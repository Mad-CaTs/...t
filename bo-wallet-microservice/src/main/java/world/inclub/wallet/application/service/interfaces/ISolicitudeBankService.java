package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import world.inclub.wallet.api.dtos.SolicitudBankMassiveUpdateDto;
import world.inclub.wallet.api.dtos.SolicitudBankStatusDto;
import world.inclub.wallet.api.dtos.SolicitudeBankFilterDto;
import world.inclub.wallet.api.dtos.SolicitudebankDTO;
import world.inclub.wallet.domain.entity.Solicitudebank;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;

import java.util.List;

public interface ISolicitudeBankService {
    Mono<Tuple2<Flux<SolicitudeBankDto>, Integer>> getPenndingAccountBankByIdUser(int page, int size, SolicitudeBankFilterDto filtros);
    public    Mono<Tuple2<Flux<SolicitudeBankDto>,Integer>>getVerificadoAccountBankByIdUser  (int page, int size,String search);
    public Mono<Solicitudebank> saveAccountBank(SolicitudebankDTO solicitudebank);
    public Mono<Boolean> updateAccountBank(SolicitudBankStatusDto solicitudebank,String username);
    Mono<Boolean> updateMasivaSolicitudeAccountBankOptimized(SolicitudBankMassiveUpdateDto solicitudBankMassiveUpdateDto,String username);
    public Mono<Boolean> updateMasivaSolicitudeAccountBank(List<SolicitudBankStatusDto> solicitudBankStatusDto,String username);
    Mono<Void> updateReviewStatus(Long idsolicitudebank,String username);
    Mono<Void>updateReviewStatusByNotificationMasives(Long idsolicitudebank);

    Mono<Boolean> updateBankStatusOnly(List<Long> solicitudIds, Integer newBankStatus);

}
