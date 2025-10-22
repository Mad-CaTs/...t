package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.adapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.exceptions.InternalServerErrorException;
import world.inclub.bonusesrewards.shared.payment.application.dto.ProcessWalletPaymentCommand;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.WalletPaymentService;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.KafkaRequestService;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.constants.KafkaConstants.Topic;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.dto.ProcessWalletPaymentDto;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.mapper.ProcessWalletPaymentMapper;


@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaWalletPaymentAdapter implements WalletPaymentService {

    private final KafkaRequestService kafkaRequestService;
    private final ProcessWalletPaymentMapper processWalletPaymentMapper;

    @Override
    public Mono<Void> sendWalletPayment(ProcessWalletPaymentCommand command) {
        ProcessWalletPaymentDto dto = processWalletPaymentMapper.toDto(command);
        return kafkaRequestService.sendRequest(
                        dto,
                        Topic.Wallet.REQUEST_REGISTER_PAYMENT_WITH_WALLET,
                        Topic.Wallet.RESPONSE_REGISTER_PAYMENT_WITH_WALLET)
                .flatMap(response -> {
                    if (response instanceof ProcessWalletPaymentDto) {
                        return Mono.just((ProcessWalletPaymentDto) response);
                    } else {
                        return Mono.error(new InternalServerErrorException("Unexpected response type"));
                    }
                })
                .doOnNext(response -> log.info("Wallet payment processed successfully: {}", response))
                .doOnError(error -> log.error("Error processing wallet payment: {}", error.getMessage()))
                .then();
    }
}
