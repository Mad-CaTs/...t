package world.inclub.bonusesrewards.shared.notification.domain;

import org.junit.jupiter.api.Test;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;
import java.time.Instant;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class NotificationTest {
    @Test
    void builder_createsNotification() {
        UUID id = UUID.randomUUID();
        Notification n = Notification.builder()
                .id(id)
                .memberId(1L)
                .typeId(2L)
                .title("title")
                .message("msg")
                .read(false)
                .createdAt(Instant.now())
                .readAt(null)
                .build();
        assertEquals(id, n.id());
        assertEquals(1L, n.memberId());
        assertEquals("title", n.title());
        assertFalse(n.read());
    }
}
