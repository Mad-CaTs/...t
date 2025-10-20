package world.inclub.appnotification.emailMassive.application.service;

import reactor.core.publisher.Flux;

public interface emailmassiveService {

    Flux<Boolean> findAllEmailAndSend();
}
