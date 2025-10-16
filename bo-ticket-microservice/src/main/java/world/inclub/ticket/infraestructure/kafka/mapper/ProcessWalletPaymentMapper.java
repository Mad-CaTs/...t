package world.inclub.ticket.infraestructure.kafka.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.ProcessWalletPaymentCommand;
import world.inclub.ticket.infraestructure.kafka.dto.ProcessWalletPaymentDto;

@Component
public class ProcessWalletPaymentMapper {

    public ProcessWalletPaymentDto toDto(ProcessWalletPaymentCommand command) {
        return ProcessWalletPaymentDto.builder()
                .idUserPayment(command.userId())
                .walletTransaction(new ProcessWalletPaymentDto.WalletTransaction(command.amount()))
                .typeWalletTransaction(45)
                .isFullPayment(true)
                .detailPayment(command.detail())
                .build();
    }

}
