package world.inclub.bonusesrewards.shared.notification.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.notification.application.usecase.CreateNotificationUseCase;
import world.inclub.bonusesrewards.shared.notification.application.usecase.GetLatestNotificationsUseCase;
import world.inclub.bonusesrewards.shared.notification.application.usecase.MarkAsReadUseCase;
import world.inclub.bonusesrewards.shared.notification.domain.model.Notification;
import world.inclub.bonusesrewards.shared.notification.infrastructure.controllers.constants.NotificationApiPaths;
import world.inclub.bonusesrewards.shared.notification.infrastructure.dto.NotificationRequest;
import world.inclub.bonusesrewards.shared.notification.infrastructure.dto.NotificationResponse;
import world.inclub.bonusesrewards.shared.notification.infrastructure.mapper.NotificationControllerMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(NotificationApiPaths.BASE)
@RequiredArgsConstructor
public class NotificationController {

    private final CreateNotificationUseCase createNotificationUseCase;
    private final GetLatestNotificationsUseCase getLatestNotificationsUseCase;
    private final MarkAsReadUseCase markAsReadUseCase;

    private final NotificationControllerMapper notificationControllerMapper;

    @PostMapping
    public Mono<ResponseEntity<ApiResponse<List<NotificationResponse>>>> createNotifications(
            @Valid @RequestBody List<NotificationRequest> requests
    ) {
        List<Notification> notifications = notificationControllerMapper.toDomainList(requests);
        return ResponseHandler.generateResponse(
                HttpStatus.CREATED,
                createNotificationUseCase.createNotifications(notifications)
                        .map(notificationControllerMapper::toResponse)
                        .collectList(),
                true
        );
    }

    @GetMapping("/latest")
    public Mono<ResponseEntity<ApiResponse<List<NotificationResponse>>>> getLatestNotifications(
            @RequestParam Long memberId,
            @RequestParam(defaultValue = "1") int limit
    ) {
        return ResponseHandler.generateResponse
                (HttpStatus.OK,
                 getLatestNotificationsUseCase.getLatestNotifications(memberId, limit)
                         .map(notificationControllerMapper::toResponse)
                         .collectList(),
                 true);
    }

    @PutMapping("/mark-as-read/{notificationId}")
    public Mono<ResponseEntity<ApiResponse<NotificationResponse>>> markAsRead(@PathVariable UUID notificationId) {
        return ResponseHandler.generateResponse
                (HttpStatus.OK,
                 markAsReadUseCase.markAsRead(notificationId)
                         .map(notificationControllerMapper::toResponse),
                 true);
    }
}