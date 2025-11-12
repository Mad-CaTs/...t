package world.inclub.transfer.liquidation.application.service.interfaces;

import org.springframework.http.codec.multipart.FilePart;

import java.util.Map;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.TransferRequest;

public interface ITransferRequestService {
    Mono<TransferRequest> createTransferRequest(Integer idUserFrom,
                                                Integer idUserTo,
                                                FilePart dniFile,
                                                FilePart declarationFile);
    Mono<TransferRequest> create(TransferRequest request);
    Mono<TransferRequest> getById(Integer id);
    Flux<TransferRequest> getAll();
    Flux<Map<String, Object>> getByUsernameEnriched(String username);
    Flux<Map<String, Object>> getByTypeEnriched(Integer transferType);
    Flux<TransferRequest> getByStatus(Integer status);
    Flux<Map<String, Object>> getByStatusEnriched(Integer status);
    Flux<Map<String, Object>> getAllEnriched();
    Mono<Map<String, Object>> updateStatusAndEnrich(Integer id, Integer newStatus);
    Mono<Map<String, Object>> getByIdEnriched(Integer id);
    Mono<TransferRequest> updateStatus(Integer id, Integer newStatus);
    Flux<Map<String, Object>> getHistoryEnrichedSorted();
    Flux<Map<String, Object>> getByStatusEnrichedSorted(Integer status);
}
