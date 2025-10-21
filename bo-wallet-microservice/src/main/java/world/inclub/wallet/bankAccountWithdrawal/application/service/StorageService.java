package world.inclub.wallet.bankAccountWithdrawal.application.service;

import reactor.core.publisher.Mono;


public interface StorageService {

     Mono<String> uploadToS3(String filename, byte[] content, String folderNumber);
}
