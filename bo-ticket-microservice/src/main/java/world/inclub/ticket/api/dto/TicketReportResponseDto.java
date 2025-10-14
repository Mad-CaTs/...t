package world.inclub.ticket.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketReportResponseDto {
    private Integer nroTicket;
    private Integer nroCompra;
    private LocalDateTime fechaCompra;
    private String zona;
    private String socio;
    private String documento;
    private String monto;
    private String tipoTicket;
    private String canjeado;
}