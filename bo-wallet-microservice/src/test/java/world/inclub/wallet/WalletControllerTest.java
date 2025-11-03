package world.inclub.wallet;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.controllers.WalletController;
import world.inclub.wallet.application.service.interfaces.IWalletService;
import world.inclub.wallet.application.service.interfaces.UserWalletDataService;
import world.inclub.wallet.application.service.interfaces.WalletExcelReportService;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.infraestructure.exception.factory.ErrorResponseFactory;
import world.inclub.wallet.infraestructure.persistence.WalletRepositoryImpl;
import world.inclub.wallet.infraestructure.serviceagent.dtos.UserAccountResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.UserWalletDataResponse;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@WebFluxTest(controllers = WalletController.class)
@TestPropertySource(properties = {
        "spring.config.import=optional:classpath:/application.yml",
        "spring.main.allow-bean-definition-overriding=true",
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.reactive.ReactiveSecurityAutoConfiguration"
})
class WalletControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean private UserWalletDataService userWalletDataService;
    @MockBean private WalletExcelReportService walletExcelReportService;
    @MockBean private WalletRepositoryImpl walletRepositoryImpl;
    @MockBean private IWalletService iWalletService;
    @MockBean private ErrorResponseFactory errorResponseFactory;

    private final UserAccountResponse userAccountResponse = new UserAccountResponse(
            1L, "erick@example.com", "erick123", "Erick", "Lozano",
            "987654321", 1L, 1L, LocalDate.now(), 'M'
    );

    private final Wallet wallet = new Wallet(1L, 1L, 1,
            BigDecimal.valueOf(1000), BigDecimal.valueOf(1000), BigDecimal.ZERO, BigDecimal.ZERO
    );

    private final UserWalletDataResponse walletDataResponse =
            new UserWalletDataResponse(userAccountResponse, wallet, List.of());

    @Test
    @DisplayName("getUserWalletData retorna 200 OK cuando el usuario existe")
    void shouldReturnUserWalletDataWhenUserExists() {
        Mockito.when(userWalletDataService.getFullWalletDataByUserId(1))
                .thenReturn(Mono.just(walletDataResponse));

        webTestClient.get()
                .uri("/api/v1/wallet/movements/{idUser}", 1)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType(MediaType.APPLICATION_JSON)
                .expectBody()
                .jsonPath("$.userAccount.name").isEqualTo("Erick")
                .jsonPath("$.wallet.availableBalance").isEqualTo(1000);
    }

    @Test
    @DisplayName("getUserWalletData retorna 404 Not Found cuando no se encuentra el usuario")
    void shouldReturnNotFoundWhenUserDoesNotExist() {
        Mockito.when(userWalletDataService.getFullWalletDataByUserId(99))
                .thenReturn(Mono.empty());

        webTestClient.get()
                .uri("/api/v1/wallet/movements/{idUser}", 99)
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    @DisplayName("downloadWalletExcel retorna archivo Excel con status 200 OK")
    void shouldReturnExcelFileWhenUserExists() {
        ByteArrayInputStream excelStream = new ByteArrayInputStream(new byte[]{1, 2, 3});

        Mockito.when(userWalletDataService.getFullWalletDataByUserId(1))
                .thenReturn(Mono.just(walletDataResponse));

        Mockito.when(walletExcelReportService.generateWalletReport(walletDataResponse))
                .thenReturn(excelStream);

        webTestClient.get()
                .uri("/api/v1/wallet/movements/{idUser}/excel", 1)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .expectHeader().valueEquals(
                        "Content-Disposition",
                        "attachment; filename=wallet_report_1.xlsx"
                )
                .expectBody(byte[].class)
                .isEqualTo(new byte[]{1, 2, 3});
    }
}