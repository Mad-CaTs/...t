package world.inclub.ticket.infraestructure.client.adapters;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.ProcessWalletPaymentCommand;
import world.inclub.ticket.application.port.WalletPaymentService;
import world.inclub.ticket.infraestructure.client.mapper.ProcessWalletPaymentMapper;

@Service
@RequiredArgsConstructor
public class WalletPaymentAdapter implements WalletPaymentService {

    private final ProcessWalletPaymentMapper mapper;
    private final WalletWebClientAdapter walletWebClientAdapter;

    @Override
    public Mono<Void> sendWalletPayment(ProcessWalletPaymentCommand command) {
        return walletWebClientAdapter.registerTransferBetweenWallets(mapper.toDto(command))
                .then();
    }
}
