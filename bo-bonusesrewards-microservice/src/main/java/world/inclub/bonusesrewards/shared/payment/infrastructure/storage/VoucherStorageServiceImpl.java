package world.inclub.bonusesrewards.shared.payment.infrastructure.storage;

import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.VoucherStorageService;

public class VoucherStorageServiceImpl implements VoucherStorageService {

    @Override
    public Mono<String> saveVoucher(FilePart filePart) {
        return null;
    }
}
