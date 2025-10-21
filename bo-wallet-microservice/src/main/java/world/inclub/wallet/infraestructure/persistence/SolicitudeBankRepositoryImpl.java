package world.inclub.wallet.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.SolicitudBankStatusDto;
import world.inclub.wallet.api.dtos.WalletTransactionResponseDTO;
import world.inclub.wallet.domain.entity.AccountBank;
import world.inclub.wallet.domain.entity.Solicitudebank;
import world.inclub.wallet.domain.port.ISolicitudeBankPort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;
import world.inclub.wallet.infraestructure.repository.ISolicitudeBankRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@Repository
@RequiredArgsConstructor
public class SolicitudeBankRepositoryImpl implements ISolicitudeBankPort {
private final ISolicitudeBankRepository iSolicitudeBankRepository;
    private final DatabaseClient databaseClient;

    @Override
public Flux<SolicitudeBankDto> getPenndingAccountBankByIdUser(Integer[] bankStatusIds) {
    return iSolicitudeBankRepository.findByIdUserByStatusPending(bankStatusIds);
}

    @Override
    public Flux<SolicitudeBankDto> getVerificadoAccountBankByIdUser() {
        return iSolicitudeBankRepository.findByIdUserByStatusVerificado();
    }
    @Override
    public Mono<Solicitudebank> saveAccountBank(Solicitudebank solicitudebank) {
        return iSolicitudeBankRepository.save(solicitudebank);
    }
    @Override
    public  Mono<Solicitudebank> updateAccountBank(Solicitudebank solicitudBankStatusDto) {
        return iSolicitudeBankRepository.save(solicitudBankStatusDto);
    }

    @Override
    public Mono<Solicitudebank> findById(Long idsolicitudebank) {
        return iSolicitudeBankRepository.findById(idsolicitudebank);
    }

    @Override
    public Mono<Void> updateBankStatus(Long idSolicitudebank, Integer idBankStatus) {
        return iSolicitudeBankRepository.updateBankStatus(idSolicitudebank, idBankStatus);
    }

    @Override
    public Mono<Void> updateBankStatusAndReview(Long id, Integer bankStatus, Integer reviewStatus){
        return iSolicitudeBankRepository.updateBankStatusAndReview(id, bankStatus, reviewStatus);
    }
}

