package world.inclub.wallet.bankAccountWithdrawal.infrastructure.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationDto;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationError;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.ValidationResult;
import world.inclub.wallet.bankAccountWithdrawal.application.enums.BankStatus;
import world.inclub.wallet.bankAccountWithdrawal.application.enums.StatusReview;
import world.inclub.wallet.domain.port.ISolicitudeBankPort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;
// import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankByClientResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class BankStatusUpdater {

    private final ISolicitudeBankPort solicitudeBankRepository;

    public Mono<Void> updateBankStatuses(ValidationResult result, List<SolicitudeBankDto> originales) {
        Map<String, Integer> accountStatusMap = buildAccountStatusMap(result);

        return Flux.fromIterable(originales)
                .flatMap(dto -> {
                    Integer status = accountStatusMap.get(dto.getNumberAccount());
                    if (status != null) {
                        if (status.equals(BankStatus.PRE_APROBADO.getId())) {
                            return solicitudeBankRepository.updateBankStatusAndReview(
                                    dto.getIdsolicitudebank(),
                                    BankStatus.PRE_APROBADO.getId(),
                                    StatusReview.NOT_DOWNLADED.getCode()
                            );
                        } else {
                            return solicitudeBankRepository.updateBankStatus(
                                    dto.getIdsolicitudebank(),
                                    status
                            );
                        }
                    }
                    return Mono.empty();
                }, 50)
                .then();
    }

    private Map<String, Integer> buildAccountStatusMap(ValidationResult result) {
        Map<String, Integer> map = new HashMap<>();

        assignStatus(result.getData().getCorrectos(), BankStatus.PRE_APROBADO, map);
        assignStatus(
                result.getData().getIncorrectos().stream()
                        .map(SubscriptionValidationError::getRegistro)
                        .toList(),
                BankStatus.PRE_RECHAZADO,
                map
        );

        return map;
    }

    private void assignStatus(List<SubscriptionValidationDto> registros, BankStatus status, Map<String, Integer> map) {
        registros.forEach(dto -> map.put(dto.getSubscriptionAccount(), status.getId()));
    }

    // public Mono<Void> updateBankStatusId(List<SolicitudeBankDto> originales, List<AccountBankByClientResponse> listByExcel ) {
    //     return Flux.fromIterable(originales)
    //     .flatMap(dto -> {
    //         if () {
                
    //         }
    //     })
    // }
    
}
