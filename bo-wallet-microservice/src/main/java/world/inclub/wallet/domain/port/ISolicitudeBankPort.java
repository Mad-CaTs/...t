package world.inclub.wallet.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.SolicitudBankStatusDto;
import world.inclub.wallet.domain.entity.AccountBank;
import world.inclub.wallet.domain.entity.Solicitudebank;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;

import java.util.List;

public interface ISolicitudeBankPort {
    Flux<SolicitudeBankDto> getPenndingAccountBankByIdUser(Integer[] bankStatusIds);
    public Flux<SolicitudeBankDto> getVerificadoAccountBankByIdUser();
    public Mono<Solicitudebank> saveAccountBank(Solicitudebank solicitudebank);
    public Mono<Solicitudebank> updateAccountBank(Solicitudebank solicitudBankStatusDto);
    Mono<Solicitudebank> findById(Long idsolicitudebank);
    Mono<Void> updateBankStatus(Long idSolicitudebank, Integer idBankStatus);
    Mono<Void> updateBankStatusAndReview(Long id, Integer bankStatus, Integer reviewStatus);
}
