package world.inclub.ticket.infraestructure.controller.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.Users;
import world.inclub.ticket.domain.model.Member;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.model.EventZone;
import world.inclub.ticket.domain.model.PaymentSubType;
import world.inclub.ticket.domain.model.SeatType;
import world.inclub.ticket.domain.model.payment.PaymentVoucher;
import world.inclub.ticket.infraestructure.controller.dto.ValidatePaymentResponseDto;

@Component
public class ValidatePaymentMapper {
    
    /**
     * Convierte Payment a ValidatePaymentResponseDto
     */
    public ValidatePaymentResponseDto toValidatePaymentResponseDto(
            Payment payment,
            Users user,
            Member member,
            Event event,
            EventZone eventZone,
            String voucherUrl,
            PaymentSubType paymentSubType,
            SeatType seatType,
            PaymentVoucher paymentVoucher) {
        
        ValidatePaymentResponseDto dto = new ValidatePaymentResponseDto();
        
        dto.setId(payment.getId());
        dto.setPaymentDate(payment.getCreatedAt());
        dto.setEventName(event != null ? event.getEventName() : "Evento no encontrado");
        dto.setZone(eventZone != null ? eventZone.getZoneName() : "Zona no encontrada");
        dto.setTicketQuantity(payment.getTicketQuantity());
        dto.setTotalAmount(payment.getCurrencyType().getSymbol() + " " + payment.getTotalAmount().toString());
        // Método de pago desde PaymentSubType
        if (paymentSubType != null) {
            dto.setPaymentMethod(paymentSubType.description());
        } else {
            dto.setPaymentMethod(payment.getMethod().toString());
        }
        
        // Datos del usuario según el tipo
        if (member != null) {
            // Usuario MEMBER - datos del microservicio de miembros
            dto.setUserName(member.name() + " " + member.lastName());
            dto.setUserDocument(member.nroDocument());
            dto.setUserEmail(member.email());
            dto.setUserPhone(member.nroPhone());
        } else if (user != null) {
            // Usuario GUEST - datos de la tabla Users local
            dto.setUserName(user.getFirstName() + " " + user.getLastName());
            dto.setUserDocument(user.getDocumentNumber());
            dto.setUserEmail(user.getEmail());
            dto.setUserPhone(user.getPhone());
        } else {
            dto.setUserName("Usuario no encontrado");
            dto.setUserDocument("N/A");
            dto.setUserEmail("N/A");
            dto.setUserPhone("N/A");
        }
        
        // Tipo de usuario desde Payment
        if (payment.getUserType() != null) {
            dto.setUserType(payment.getUserType().name());
        } else {
            dto.setUserType("N/A");
        }
        
        // URL del comprobante desde payments_vouchers
        dto.setImageUrl(voucherUrl != null && !voucherUrl.isEmpty() ? voucherUrl : "");
        
        // Campos adicionales de la imagen
        // Patrocinador
        if (user != null && user.getSponsor() != null) {
            dto.setSponsorName(user.getSponsor());
        } else {
            dto.setSponsorName("Sin patrocinador");
        }
        
        // Tipo de entrada
        if (seatType != null) {
            dto.setTicketTypeName(seatType.getSeatTypeName());
        } else {
            dto.setTicketTypeName("Tipo no especificado");
        }
        
        // Código promocional (no existe en Payment, se deja vacío por ahora)
        dto.setPromotionalCode("-");
        
        // Estado del pago
        if (payment != null && payment.getStatus() != null) {
            dto.setPaymentStatus(payment.getStatus().toString());
        } else {
            dto.setPaymentStatus("Pendiente");
        }
        
        // Número de operación del voucher
        if (paymentVoucher != null && paymentVoucher.getOperationNumber() != null) {
            dto.setVoucherOperationNumber(paymentVoucher.getOperationNumber());
        } else {
            dto.setVoucherOperationNumber("-");
        }
        
        return dto;
    }
}
