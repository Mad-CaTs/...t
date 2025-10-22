package world.inclub.membershippayment.payPayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.exception.common.ResourceNotFoundException;
import world.inclub.membershippayment.domain.dto.LegalizationResponseDTO;

import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LegalizationService {

    private final SuscriptionPaymentService suscriptionPaymentService;

    public Mono<List<LegalizationResponseDTO>> checkLegalizationEligibility(Integer idUser) {

        return suscriptionPaymentService.getSuscriptions(idUser)
                .flatMapMany(Flux::fromIterable) // recorrer todas las suscripciones
                .flatMap(suscription ->
                        suscriptionPaymentService.getCronogramaPagos(suscription.getId().intValue())
                                .map(payments -> {
                                    // 1. verifica contrato
                                    boolean contrato = payments.stream().anyMatch(p ->
                                            p.getIsInitialQuote() == 1 && p.getIdStatePayment() == 1);

                                    // 2. cuenta pagos realizados
                                    long totalPagadas = payments.stream()
                                            .filter(p -> p.getIdStatePayment() == 1)
                                            .count();

                                    // 3. verificar certificado
                                    boolean certificado = contrato && totalPagadas >= 12;

                                    // 4. respuesta
                                    return new LegalizationResponseDTO(
                                            suscription.getId().intValue(),
                                            suscription.getIdFamilyPackage(),
                                            suscription.getFamilyPackageName(),
                                            suscription.getNameSuscription(),
                                            suscription.getIdStatus(),
                                            contrato ? 1 : 0,
                                            certificado ? 1 : 0
                                    );
                                })
                )
                .sort(Comparator.comparing(LegalizationResponseDTO::getId).reversed())
                .collectList()
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("No se encontraron suscripciones para el usuario")));
    }
}
