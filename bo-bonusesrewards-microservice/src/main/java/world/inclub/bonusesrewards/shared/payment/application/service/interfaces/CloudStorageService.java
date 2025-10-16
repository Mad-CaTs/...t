package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

public interface CloudStorageService {

    Mono<String> save(FilePart filePart, String folderNumber);

    Mono<String> saveMultiPart(MultipartFile file, String folderNumber);

}
