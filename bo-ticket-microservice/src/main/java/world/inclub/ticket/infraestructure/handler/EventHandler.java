package world.inclub.ticket.infraestructure.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FormFieldPart;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventRequestDto;
import world.inclub.ticket.api.dto.EventResponseDto;
import world.inclub.ticket.api.dto.PastEventResponseDto;
import world.inclub.ticket.api.dto.PublicEventResponseDto;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class EventHandler {
    private final CreateEventUseCase createUseCase;
    private final GetAllEventUseCase getAllUseCase;
    private final UpdateEventUseCase updateUseCase;
    private final DeleteEventUseCase deleteUseCase;
    private final GetEventUseCase getUseCase;
    private final GetPastEventsUseCase getPastEventsUseCase;
    private final GetCanceledEventsUseCase getCanceledEventsUseCase;
    private final GetActiveEventsUseCase getActiveEventsUseCase;
    private final GetOngoingEventsUseCase getOngoingEventsUseCase;
    private final GetInactiveEventsUseCase getInactiveEventsUseCase;
    private final GetPublicEventsUseCase getPublicEventsUseCase;
    private final GetPublicEventsWithZonesUseCase getPublicEventsWithZonesUseCase;
    private final GetPublicEventByIdUseCase getPublicEventByIdUseCase;
    private final GetPublicEventWithZonesByIdUseCase getPublicEventWithZonesByIdUseCase;
    private final UpdatePastEventUseCase updatePastEventUseCase;
    private final GetPastEventByIdUseCase getPastEventByIdUseCase;

    public Mono<ServerResponse> create(ServerRequest request) {
        return request.multipartData()
                .map(multiValueMap -> {
                    EventRequestDto dto = new EventRequestDto();
                    if (multiValueMap.getFirst("eventName") != null) {
                        dto.setEventName(((FormFieldPart) multiValueMap.getFirst("eventName")).value());
                    }
                    if (multiValueMap.getFirst("isMainEvent") != null) {
                        dto.setIsMainEvent(Boolean.parseBoolean(((FormFieldPart) multiValueMap.getFirst("isMainEvent")).value()));
                    }
                    if (multiValueMap.getFirst("ticketTypeId") != null) {
                        dto.setTicketTypeId(Integer.parseInt(((FormFieldPart) multiValueMap.getFirst("ticketTypeId")).value()));
                    }
                    if (multiValueMap.getFirst("eventTypeId") != null) {
                        dto.setEventTypeId(Integer.parseInt(((FormFieldPart) multiValueMap.getFirst("eventTypeId")).value()));
                    }
                    if (multiValueMap.getFirst("eventDate") != null) {
                        dto.setEventDate(LocalDate.parse(((FormFieldPart) multiValueMap.getFirst("eventDate")).value()));
                    }
                    if (multiValueMap.getFirst("startDate") != null) {
                        dto.setStartDate(LocalTime.parse(((FormFieldPart) multiValueMap.getFirst("startDate")).value()));
                    }
                    if (multiValueMap.getFirst("endDate") != null) {
                        dto.setEndDate(LocalTime.parse(((FormFieldPart) multiValueMap.getFirst("endDate")).value()));
                    }
                    if (multiValueMap.getFirst("venueId") != null) {
                        dto.setVenueId(Integer.parseInt(((FormFieldPart) multiValueMap.getFirst("venueId")).value()));
                    }
                    if (multiValueMap.getFirst("eventUrl") != null) {
                        dto.setEventUrl(((FormFieldPart) multiValueMap.getFirst("eventUrl")).value());
                    }
                    if (multiValueMap.getFirst("statusEvent") != null) {
                        dto.setStatusEvent(((FormFieldPart) multiValueMap.getFirst("statusEvent")).value());
                    }
                    if (multiValueMap.getFirst("description") != null) {
                        dto.setDescription(((FormFieldPart) multiValueMap.getFirst("description")).value());
                    }
                    if (multiValueMap.getFirst("presenter") != null) {
                        dto.setPresenter(((FormFieldPart) multiValueMap.getFirst("presenter")).value());
                    }
                    if (multiValueMap.containsKey("flyerFile")) {
                        dto.setFlyerFile((FilePart) multiValueMap.getFirst("flyerFile"));
                    }
                    if (multiValueMap.containsKey("imageFile")) {
                        dto.setImageFile((FilePart) multiValueMap.getFirst("imageFile"));
                    }
                    if (multiValueMap.containsKey("secondImageFile")) {
                        dto.setSecondImageFile((FilePart) multiValueMap.getFirst("secondImageFile"));
                    }
                    if (multiValueMap.getFirst("videoUrl") != null) {
                        dto.setVideoUrl(((FormFieldPart) multiValueMap.getFirst("videoUrl")).value());
                    }
                    return dto;
                })
                .flatMap(dto -> createUseCase.create(dto, UUID.randomUUID()))
                .flatMap(result -> ServerResponse.created(request.uri())
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al crear el Evento: " + e.getMessage()));
    }

    public Mono<ServerResponse> updatePastEvent(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return request.multipartData()
                .map(multiValueMap -> {
                    EventRequestDto dto = new EventRequestDto();
                    if (multiValueMap.getFirst("description") != null) {
                        dto.setDescription(((FormFieldPart) multiValueMap.getFirst("description")).value());
                    }
                    if (multiValueMap.containsKey("imageFile")) {
                        dto.setImageFile((FilePart) multiValueMap.getFirst("imageFile"));
                    }
                    if (multiValueMap.containsKey("secondImageFile")) {
                        dto.setSecondImageFile((FilePart) multiValueMap.getFirst("secondImageFile"));
                    }
                    if (multiValueMap.getFirst("videoUrl") != null) {
                        dto.setVideoUrl(((FormFieldPart) multiValueMap.getFirst("videoUrl")).value());
                    }
                    return dto;
                })
                .flatMap(dto -> updatePastEventUseCase.updatePastEvent(id, dto, UUID.randomUUID()))
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al actualizar el evento pasado: " + e.getMessage()));
    }

    public Mono<ServerResponse> getAll(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getAllUseCase.getAll(), EventResponseDto.class);
    }

    public Mono<ServerResponse> getById(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return getUseCase.getEvent(id)
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al obtener el Evento: " + e.getMessage()));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return request.multipartData()
                .map(multiValueMap -> {
                    EventRequestDto dto = new EventRequestDto();
                    if (multiValueMap.getFirst("eventName") != null) {
                        dto.setEventName(((FormFieldPart) multiValueMap.getFirst("eventName")).value());
                    }
                    if (multiValueMap.getFirst("isMainEvent") != null) {
                        dto.setIsMainEvent(Boolean.parseBoolean(((FormFieldPart) multiValueMap.getFirst("isMainEvent")).value()));
                    }
                    if (multiValueMap.getFirst("ticketTypeId") != null) {
                        dto.setTicketTypeId(Integer.parseInt(((FormFieldPart) multiValueMap.getFirst("ticketTypeId")).value()));
                    }
                    if (multiValueMap.getFirst("eventTypeId") != null) {
                        dto.setEventTypeId(Integer.parseInt(((FormFieldPart) multiValueMap.getFirst("eventTypeId")).value()));
                    }
                    if (multiValueMap.getFirst("eventDate") != null) {
                        dto.setEventDate(LocalDate.parse(((FormFieldPart) multiValueMap.getFirst("eventDate")).value()));
                    }
                    if (multiValueMap.getFirst("startDate") != null) {
                        dto.setStartDate(LocalTime.parse(((FormFieldPart) multiValueMap.getFirst("startDate")).value()));
                    }
                    if (multiValueMap.getFirst("endDate") != null) {
                        dto.setEndDate(LocalTime.parse(((FormFieldPart) multiValueMap.getFirst("endDate")).value()));
                    }
                    if (multiValueMap.getFirst("venueId") != null) {
                        dto.setVenueId(Integer.parseInt(((FormFieldPart) multiValueMap.getFirst("venueId")).value()));
                    }
                    if (multiValueMap.getFirst("eventUrl") != null) {
                        dto.setEventUrl(((FormFieldPart) multiValueMap.getFirst("eventUrl")).value());
                    }
                    if (multiValueMap.getFirst("statusEvent") != null) {
                        dto.setStatusEvent(((FormFieldPart) multiValueMap.getFirst("statusEvent")).value());
                    }
                    if (multiValueMap.getFirst("description") != null) {
                        dto.setDescription(((FormFieldPart) multiValueMap.getFirst("description")).value());
                    }
                    if (multiValueMap.getFirst("presenter") != null) {
                        dto.setPresenter(((FormFieldPart) multiValueMap.getFirst("presenter")).value());
                    }
                    if (multiValueMap.containsKey("flyerFile")) {
                        dto.setFlyerFile((FilePart) multiValueMap.getFirst("flyerFile"));
                    }
                    if (multiValueMap.containsKey("imageFile")) {
                        dto.setImageFile((FilePart) multiValueMap.getFirst("imageFile"));
                    }
                    if (multiValueMap.containsKey("secondImageFile")) {
                        dto.setSecondImageFile((FilePart) multiValueMap.getFirst("secondImageFile"));
                    }
                    if (multiValueMap.getFirst("videoUrl") != null) {
                        dto.setVideoUrl(((FormFieldPart) multiValueMap.getFirst("videoUrl")).value());
                    }
                    return dto;
                })
                .flatMap(dto -> updateUseCase.update(id, dto, UUID.randomUUID()))
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al actualizar el Evento: " + e.getMessage()));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return deleteUseCase.deleteById(id)
                .then(ServerResponse.noContent().build())
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al eliminar el Evento: " + e.getMessage()));
    }

    public Mono<ServerResponse> getPastEvents(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getPastEventsUseCase.getPastEvents(), PastEventResponseDto.class);
    }

    public Mono<ServerResponse> getPastEventById(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return getPastEventByIdUseCase.getPastEventById(id)
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al obtener el evento pasado: " + e.getMessage()));
    }

    public Mono<ServerResponse> getCanceledEvents(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getCanceledEventsUseCase.getCanceledEvents(), EventResponseDto.class);
    }

    public Mono<ServerResponse> getActiveEvents(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getActiveEventsUseCase.getActiveEvents(), EventResponseDto.class);
    }

    public Mono<ServerResponse> getOngoingEvents(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getOngoingEventsUseCase.getOngoingEvents(), EventResponseDto.class);
    }

    public Mono<ServerResponse> getInactiveEvents(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getInactiveEventsUseCase.getInactiveEvents(), EventResponseDto.class);
    }

    public Mono<ServerResponse> getPublicEvents(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getPublicEventsUseCase.getPublicEvents(), PublicEventResponseDto.class);
    }

    public Mono<ServerResponse> getPublicEventsWithZones(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(getPublicEventsWithZonesUseCase.getPublicEventsWithZones(), PublicEventWithZonesResponseDto.class);
    }

    public Mono<ServerResponse> getPublicEventById(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return getPublicEventByIdUseCase.getPublicEventById(id)
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al obtener el evento público: " + e.getMessage()));
    }

    public Mono<ServerResponse> getPublicEventWithZonesById(ServerRequest request) {
        Integer id = Integer.valueOf(request.pathVariable("id"));
        return getPublicEventWithZonesByIdUseCase.getPublicEventWithZonesById(id)
                .flatMap(result -> ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(result))
                .onErrorResume(NotFoundException.class, e -> ServerResponse.notFound().build())
                .onErrorResume(e -> ServerResponse.badRequest()
                        .bodyValue("Error al obtener el evento público con zonas: " + e.getMessage()));
    }
}