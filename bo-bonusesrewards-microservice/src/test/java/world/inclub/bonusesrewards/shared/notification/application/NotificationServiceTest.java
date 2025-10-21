package world.inclub.bonusesrewards.shared.notification.application;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.notification.application.service.NotificationService;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;
import world.inclub.bonusesrewards.shared.notification.domain.port.NotificationRepositoryPort;
import java.util.List;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class NotificationServiceTest {
    @Test
    void createNotifications_savesAll() {
        NotificationRepositoryPort repo = Mockito.mock(NotificationRepositoryPort.class);
        NotificationService service = new NotificationService(repo);
        Notification n = Notification.builder().memberId(1L).typeId(2L).title("t").message("m").build();
        when(repo.saveAll(anyList())).thenReturn(Flux.fromIterable(List.of(n)));
        List<Notification> saved = service.createNotifications(List.of(n)).collectList().block();
        assertNotNull(saved);
        assertEquals(1, saved.size());
        assertEquals("t", saved.get(0).title());
    }

    @Test
    void markAsRead_returnsNotification() {
        NotificationRepositoryPort repo = Mockito.mock(NotificationRepositoryPort.class);
        NotificationService service = new NotificationService(repo);
        Notification n = Notification.builder().id(UUID.randomUUID()).read(true).build();
        when(repo.markAsRead(any(UUID.class))).thenReturn(Mono.just(n));
        Notification marked = service.markAsRead(UUID.randomUUID()).block();
        assertTrue(marked.read());
    }
}
