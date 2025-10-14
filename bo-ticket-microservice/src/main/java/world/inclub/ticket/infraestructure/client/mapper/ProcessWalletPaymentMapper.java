package world.inclub.ticket.infraestructure.client.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.ProcessWalletPaymentCommand;
import world.inclub.ticket.infraestructure.kafka.dto.ProcessWalletPaymentDto;

@Component
public class ProcessWalletPaymentMapper {

    public ProcessWalletPaymentDto toDto(ProcessWalletPaymentCommand command) {
        // For now we use a fixed receiver user id
        Integer receiverUserId = 22115;
        return ProcessWalletPaymentDto.builder()
                .senderUserId(command.userId().intValue())
                .receiverUserId(receiverUserId)
                .amount(command.amount())
                .sendCodeId(45)
                .receiveCodeId(13)
                .referenceDataSender(command.detail())
                .referenceDataReceiver("Transferencia recibida por la compra de ticket(s) por el usuario :")
                .build();
    }

}
