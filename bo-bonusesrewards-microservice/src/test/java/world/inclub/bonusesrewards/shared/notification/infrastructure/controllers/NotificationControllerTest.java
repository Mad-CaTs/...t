package world.inclub.bonusesrewards.shared.notification.infrastructure.controllers;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.notification.application.usecase.CreateNotificationUseCase;
import world.inclub.bonusesrewards.shared.notification.application.usecase.GetLatestNotificationsUseCase;
import world.inclub.bonusesrewards.shared.notification.application.usecase.MarkAsReadUseCase;
import world.inclub.bonusesrewards.shared.notification.infrastructure.dto.NotificationRequest;
import world.inclub.bonusesrewards.shared.notification.infrastructure.dto.NotificationResponse;
import world.inclub.bonusesrewards.shared.notification.infrastructure.mapper.NotificationControllerMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class NotificationControllerTest {
    @Test
    void createNotifications_returnsCreatedList() {
        CreateNotificationUseCase createUC = Mockito.mock(CreateNotificationUseCase.class);
        NotificationControllerMapper mapper = new NotificationControllerMapper();
        NotificationController controller = new NotificationController(createUC, null, null, mapper);
        NotificationRequest req = new NotificationRequest(1L, 2L, "title", "msg");
        Notification notification = mapper.toDomain(req);
        when(createUC.createNotifications(anyList())).thenReturn(reactor.core.publisher.Flux.fromIterable(List.of(notification)));

        Mono<ResponseEntity<ApiResponse<List<NotificationResponse>>>> result = controller.createNotifications(List.of(req));
        ResponseEntity<ApiResponse<List<NotificationResponse>>> entity = result.block();
        assertNotNull(entity);
        assertEquals(HttpStatus.CREATED, entity.getStatusCode());
        assertNotNull(entity.getBody());
        assertFalse(entity.getBody().data().isEmpty());
    }

    @Test
    void getLatestNotifications_returnsList() {
        GetLatestNotificationsUseCase getUC = Mockito.mock(GetLatestNotificationsUseCase.class);
        NotificationControllerMapper mapper = new NotificationControllerMapper();
        NotificationController controller = new NotificationController(null, getUC, null, mapper);
        Notification notification = Notification.builder().memberId(1L).typeId(2L).title("t").message("m").read(false).build();
        when(getUC.getLatestNotifications(anyLong(), anyInt())).thenReturn(reactor.core.publisher.Flux.fromIterable(List.of(notification)));
        Mono<ResponseEntity<ApiResponse<List<NotificationResponse>>>> result = controller.getLatestNotifications(1L, 1);
        ResponseEntity<ApiResponse<List<NotificationResponse>>> entity = result.block();
        assertNotNull(entity);
        assertEquals(HttpStatus.OK, entity.getStatusCode());
    }

    @Test
    void markAsRead_returnsNotification() {
        MarkAsReadUseCase markUC = Mockito.mock(MarkAsReadUseCase.class);
        NotificationControllerMapper mapper = new NotificationControllerMapper();
        NotificationController controller = new NotificationController(null, null, markUC, mapper);
        Notification notification = Notification.builder().id(UUID.randomUUID()).read(true).build();
        when(markUC.markAsRead(any(UUID.class))).thenReturn(Mono.just(notification));
        Mono<ResponseEntity<ApiResponse<NotificationResponse>>> result = controller.markAsRead(UUID.randomUUID());
        ResponseEntity<ApiResponse<NotificationResponse>> entity = result.block();
        assertNotNull(entity);
        assertEquals(HttpStatus.OK, entity.getStatusCode());
    }
}
