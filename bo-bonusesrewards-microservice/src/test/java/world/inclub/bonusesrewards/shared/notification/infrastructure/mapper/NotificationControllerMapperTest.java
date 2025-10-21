package world.inclub.bonusesrewards.shared.notification.infrastructure.mapper;

import org.junit.jupiter.api.Test;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;
import world.inclub.bonusesrewards.shared.notification.infrastructure.dto.NotificationRequest;
import world.inclub.bonusesrewards.shared.notification.infrastructure.dto.NotificationResponse;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class NotificationControllerMapperTest {
    @Test
    void toDomain_mapsRequest() {
        NotificationControllerMapper mapper = new NotificationControllerMapper();
        NotificationRequest req = new NotificationRequest(1L, 2L, "title", "msg");
        Notification n = mapper.toDomain(req);
        assertEquals(1L, n.memberId());
        assertEquals("title", n.title());
    }

    @Test
    void toDomainList_mapsList() {
        NotificationControllerMapper mapper = new NotificationControllerMapper();
        NotificationRequest req = new NotificationRequest(1L, 2L, "title", "msg");
        List<Notification> list = mapper.toDomainList(List.of(req));
        assertEquals(1, list.size());
        assertEquals("msg", list.get(0).message());
    }

    @Test
    void toResponse_mapsDomain() {
        NotificationControllerMapper mapper = new NotificationControllerMapper();
        Notification n = Notification.builder().id(UUID.randomUUID()).memberId(1L).typeId(2L).title("t").message("m").read(false).createdAt(null).readAt(null).build();
        NotificationResponse resp = mapper.toResponse(n);
        assertEquals("t", resp.title());
        assertEquals(false, resp.isRead());
    }
}
