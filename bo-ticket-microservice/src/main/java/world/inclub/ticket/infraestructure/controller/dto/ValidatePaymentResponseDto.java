package world.inclub.ticket.infraestructure.controller.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ValidatePaymentResponseDto {
    
    private Long id; // N° del pago
    private LocalDateTime paymentDate; // Fecha de pago
    private String eventName; // Nombre del evento
    private String zone; // Zona
    private Integer ticketQuantity; // N° de entradas
    private String userName; // Socio (nombre del usuario)
    private String totalAmount; // Monto
    private String imageUrl; // URL de la imagen/comprobante
    private String paymentMethod; // Método de pago
    private String userDocument; // Documento del usuario
    private String userEmail; // Email del usuario
    private String userPhone; // Teléfono del usuario
    private String userType; // Tipo de usuario (MEMBER/GUEST)
    
    // Campos adicionales de la imagen
    private String sponsorName; // Patrocinador
    private String ticketTypeName; // Tipo de entrada
    private String promotionalCode; // Código promocional
    private String paymentStatus; // Estado del pago
    private String voucherOperationNumber; // Número de operación del voucher
}
