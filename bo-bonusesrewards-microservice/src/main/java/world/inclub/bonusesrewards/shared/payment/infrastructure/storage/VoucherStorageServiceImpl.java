package world.inclub.bonusesrewards.shared.payment.infrastructure.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.CloudStorageService;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.VoucherStorageService;
import world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure.StorageProperties;

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
