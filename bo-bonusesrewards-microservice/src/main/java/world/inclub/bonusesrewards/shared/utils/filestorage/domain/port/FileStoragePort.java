package world.inclub.bonusesrewards.shared.utils.filestorage.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileContext;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

public interface FileStoragePort {
    Mono<String> save(FileResource file, FileContext context);
}