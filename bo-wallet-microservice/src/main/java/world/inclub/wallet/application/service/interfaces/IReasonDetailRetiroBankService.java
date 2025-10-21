package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.SolicitudebankDTO;
import world.inclub.wallet.domain.entity.ReasonDetailRetiroBank;
import world.inclub.wallet.domain.entity.Solicitudebank;

public interface IReasonDetailRetiroBankService {
    public Mono<ReasonDetailRetiroBank> saveReasonDetailRetiroBank(ReasonDetailRetiroBank reasonDetailRetiroBank);

}
