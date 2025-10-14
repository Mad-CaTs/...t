package world.inclub.ticket.infraestructure.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.port.CloudStorageService;
import world.inclub.ticket.application.port.VoucherStorageService;

@Service
@RequiredArgsConstructor
public class VoucherStorageServiceImpl implements VoucherStorageService {

    private final CloudStorageService cloudStorageService;
    private final StorageProperties storageProperties;

    @Override
    public Mono<String> saveVoucher(FilePart filePart) {
        return cloudStorageService.save(filePart, storageProperties.vouchersFolder());
    }

}
