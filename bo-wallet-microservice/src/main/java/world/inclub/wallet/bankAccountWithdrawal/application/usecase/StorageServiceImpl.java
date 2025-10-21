package world.inclub.wallet.bankAccountWithdrawal.application.usecase;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.processor.InMemoryFilePart;
import world.inclub.wallet.bankAccountWithdrawal.application.service.StorageService;
import world.inclub.wallet.infraestructure.serviceagent.service.DocumentService;

@Slf4j
@Service
@RequiredArgsConstructor
public class StorageServiceImpl implements StorageService {

    private final DocumentService documentService;

    @Override
    public Mono<String> uploadToS3(String filename, byte[] content, String folderNumber) {
        FilePart filePart = new InMemoryFilePart(filename, content);
        return documentService.postDataToExternalAPI(Mono.just(filePart), folderNumber);
    }
}
