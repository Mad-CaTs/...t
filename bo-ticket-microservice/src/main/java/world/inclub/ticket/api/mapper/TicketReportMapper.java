package world.inclub.ticket.api.mapper;

import world.inclub.ticket.api.dto.TicketReportResponseDto;
import world.inclub.ticket.domain.model.ticket.TicketReport;

public class TicketReportMapper {

    public static TicketReportResponseDto toDto(TicketReport model) {
        TicketReportResponseDto dto = new TicketReportResponseDto();
        dto.setNroTicket(model.getNroTicket());
        dto.setNroCompra(model.getNroCompra());
        dto.setFechaCompra(model.getFechaCompra());
        dto.setZona(model.getZona());
        dto.setSocio(model.getSocio());
        dto.setDocumento(model.getDocumento());
        dto.setMonto(model.getMonto());
        dto.setTipoTicket(model.getTipoTicket());
        dto.setCanjeado(model.getCanjeado());
        return dto;
    }
}
