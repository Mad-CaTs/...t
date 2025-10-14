package world.inclub.ticket.infraestructure.persistence.r2dbc.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.ticket.TicketReport;

import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor
public class R2DbcTicketReportRepository {

    private final DatabaseClient databaseClient;

    public Flux<TicketReport> findReportByEventId(Integer eventId) {
        String sql = """
                SELECT
                    t.ticket_id AS nro_ticket,
                    p.payment_id AS nro_compra,
                    p.created_at AS fecha_compra,
                    ez.zonename AS zona,
                    a.name || ' ' || a.last_name AS socio,
                    a.document_number AS documento,
                    CASE
                        WHEN p.currency_type = 'PEN' THEN 'S/ ' || TO_CHAR(p.total_amount, 'FM999999990.00')
                        WHEN p.currency_type = 'USD' THEN '$ '  || TO_CHAR(p.total_amount, 'FM999999990.00')
                        ELSE p.currency_type || ' ' || TO_CHAR(p.total_amount, 'FM999999990.00')
                    END AS monto,
                    CASE
                        WHEN EXISTS (
                            SELECT 1
                            FROM payment_detail pd
                            WHERE pd.payment_id = p.payment_id
                              AND pd.item_type_id = 2
                        )
                        THEN 'PAQUETE'
                        ELSE 'NORMAL'
                    END AS tipo_ticket,
                    CASE
                        WHEN t.used_at IS NOT NULL THEN 'SI'
                        ELSE 'NO'
                    END AS canjeado
                FROM tickets t
                JOIN attendees a ON t.attendee_id = a.attendee_id
                JOIN payments p ON t.payment_id = p.payment_id
                JOIN event_zone ez ON t.event_zone_id = ez.eventzoneid
                WHERE t.event_id = :eventId
                  AND p.status = 'APPROVED'
                ORDER BY p.created_at DESC
                """;

        return databaseClient.sql(sql)
                .bind("eventId", eventId)
                .map((row, meta) -> {
                    TicketReport tr = new TicketReport();
                    tr.setNroTicket(row.get("nro_ticket", Integer.class));
                    tr.setNroCompra(row.get("nro_compra", Integer.class));
                    tr.setFechaCompra(row.get("fecha_compra", LocalDateTime.class));
                    tr.setZona(row.get("zona", String.class));
                    tr.setSocio(row.get("socio", String.class));
                    tr.setDocumento(row.get("documento", String.class));
                    tr.setMonto(row.get("monto", String.class));
                    tr.setTipoTicket(row.get("tipo_ticket", String.class));
                    tr.setCanjeado(row.get("canjeado", String.class));
                    return tr;
                })
                .all();
    }
}
