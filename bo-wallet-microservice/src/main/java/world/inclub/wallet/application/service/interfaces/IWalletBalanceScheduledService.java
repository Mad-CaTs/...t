package world.inclub.wallet.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.wallet.application.scheduler.WalletScheduledResult;

public interface IWalletBalanceScheduledService {

    Mono<WalletScheduledResult> reconcileAllWallets();
}
