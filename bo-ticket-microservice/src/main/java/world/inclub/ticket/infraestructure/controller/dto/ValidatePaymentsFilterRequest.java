package world.inclub.ticket.infraestructure.controller.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class ValidatePaymentsFilterRequest {
    
    private String search; // Buscador: nombre, evento, socio, etc.
    
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate paymentDate; // Fecha de pago
    
    private Integer page = 0; // Página (0-based)
    private Integer size = 10; // Tamaño de página
}
