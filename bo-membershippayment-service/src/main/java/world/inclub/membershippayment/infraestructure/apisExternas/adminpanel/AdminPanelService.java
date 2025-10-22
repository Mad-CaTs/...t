package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.exception.core.ExternalApiException;
import world.inclub.membershippayment.domain.dto.response.FamilyPackageDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.DataResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PaymentSubType;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PercentOverdueDetail;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.TypeExchangeResponse;
import world.inclub.membershippayment.domain.dto.request.ValidateCouponRequest;
import world.inclub.membershippayment.domain.dto.response.ValidateCouponResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;



@Slf4j
@Service
@RequiredArgsConstructor
public class AdminPanelService {

    @Qualifier("adminPanelWebClient")
    private final WebClient adminPanelWebClient;

    // Método genérico para obtener solo el contenido de "data" desde diferentes
    // endpoints
    public <T> Mono<T> getDataContent(String uri, ParameterizedTypeReference<DataResponse<T>> responseType) {
        return adminPanelWebClient.get()
                .uri(uri)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse -> 
                clientResponse.bodyToMono(String.class)
                    .flatMap(errorBody -> {
                        log.error("Error calling external API: Status Code: {}, Body: {}",
                                  clientResponse.statusCode(),
                                  errorBody);
                        return Mono.error(new ExternalApiException("External API error: " + errorBody));
                    })
            )
                .bodyToMono(responseType)
                .map(DataResponse::getData); // Extrae solo el contenido de "data"
    }

    public Mono<TypeExchangeResponse> getTypeExchange() {
        return getDataContent("exchangerate/getexchange",
                new ParameterizedTypeReference<DataResponse<TypeExchangeResponse>>() {
                })
                .doOnNext(typeExchange -> log.info("Obtained type exchange: {}", typeExchange))
                .doOnError(e -> log.error("Error obtaining type exchange", e));
    }

    public Mono<PaymentSubType> getPaymentSubType(Integer idPaymentSubType) {
        return getDataContent("paymentsubtype/" + idPaymentSubType,
                new ParameterizedTypeReference<DataResponse<PaymentSubType>>() {
                });
    }

    public Mono<ObjModel> getPackData(Integer idPackage, Integer idPaymentSubType) {
        String apiUrl;
        if (idPaymentSubType != null) {
            apiUrl = "package/packageRegister" + "/" + idPackage + "/" + idPaymentSubType;
        } else {
            apiUrl = "package/packageRegister" + "/" + idPackage;
        }
        return getDataContent(apiUrl, new ParameterizedTypeReference<DataResponse<ObjModel>>() {
        });
    }

    public Mono<PackageDTO> getPackageData(Integer idPackage, Integer idPackageDetail) {
        String apiUrl = "packagedetail/" + idPackageDetail + "/package/" + idPackage;
        return getDataContent(apiUrl, new ParameterizedTypeReference<DataResponse<PackageDTO>>() {
        });
    }

    public Mono<PercentOverdueDetail> getPercentdetailActive(int typePercentOverdue) {

        Integer status = 1;
        String apiUrl = "percentOverdueDetail/percentOverdueType/" + typePercentOverdue + "/status/" + status;

        return getDataContent(apiUrl, new ParameterizedTypeReference<DataResponse<PercentOverdueDetail>>() {
        });

    }

    public Mono<FamilyPackageDTO> getFamilyData(Integer idFamily) {
        String apiUrl = "familypackage/" + idFamily;
        return getDataContent(apiUrl, new ParameterizedTypeReference<DataResponse<FamilyPackageDTO>>() {});
    }

    public Mono<ObjModel> getPackDataWithoutSubType(int idPackage) {
        String apiUrl = "package/packageRegister/" + idPackage;
        return getDataContent(apiUrl, new ParameterizedTypeReference<DataResponse<ObjModel>>() {});
    }

    public Mono<ValidateCouponResponse> validateCoupon(ValidateCouponRequest request) {
        return adminPanelWebClient.post()
                .uri("coupons/validate")
                .body(Mono.just(request), ValidateCouponRequest.class)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error calling coupon validation API: Status Code: {}, Body: {}",
                                            clientResponse.statusCode(),
                                            errorBody);
                                    return Mono.error(new ExternalApiException("External API error: " + errorBody));
                                })
                )
                .bodyToMono(ValidateCouponResponse.class)
                .doOnNext(response -> log.info("Coupon validation response: {}", response))
                .doOnError(e -> log.error("Error during coupon validation", e));
    }

}