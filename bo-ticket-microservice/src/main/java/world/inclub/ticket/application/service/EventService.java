package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventRequestDto;
import world.inclub.ticket.api.dto.EventResponseDto;
import world.inclub.ticket.api.dto.PastEventResponseDto;
import world.inclub.ticket.api.dto.PublicEventResponseDto;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;
import world.inclub.ticket.api.mapper.EventMapper;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.model.EventVenue;
import world.inclub.ticket.domain.model.EventMedia;
import world.inclub.ticket.domain.repository.EventRepository;
import world.inclub.ticket.domain.repository.EventTypeRepository;
import world.inclub.ticket.domain.repository.EventVenueRepository;
import world.inclub.ticket.domain.repository.EventZoneRepository;
import world.inclub.ticket.domain.repository.EventMediaRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Comparator;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService implements CreateEventUseCase,
        GetAllEventUseCase,
        GetEventUseCase,
        UpdateEventUseCase,
        DeleteEventUseCase,
        GetPastEventsUseCase,
        GetCanceledEventsUseCase,
        GetActiveEventsUseCase,
        GetOngoingEventsUseCase,
        GetInactiveEventsUseCase,
        GetPublicEventsUseCase,
        GetPublicEventsWithZonesUseCase,
        GetPublicEventByIdUseCase,
        GetPublicEventWithZonesByIdUseCase,
        UpdatePastEventUseCase,
        GetEventByIdInUseCase,
        GetPastEventByIdUseCase,
        GetEventWithZonesByIdUseCase {

    private final EventRepository repository;
    private final EventZoneRepository eventZoneRepository;
    private final EventTypeRepository eventTypeRepository;
    private final EventVenueRepository eventVenueRepository;
    private final EventMediaRepository eventMediaRepository;
    private final EventMapper mapper;
    private final WebClient documentWebClient;

    @PostConstruct
    public void updatePastEventsOnStartup() {
        repository.findAll()
                .filter(event -> event.getEventDate() != null
                        && event.getEventDate().isBefore(LocalDate.now())
                        && event.getStatusEvent().equals("activo"))
                .flatMap(event -> {
                    event.setStatusEvent("pasado");
                    return repository.save(event);
                })
                .subscribe();
    }

    @Override
    public Mono<EventResponseDto> create(EventRequestDto dto, UUID createdBy) {
        Event domain = mapper.toDomain(dto);
        domain.setCreatedBy(createdBy);
        domain.setUpdatedBy(createdBy);
        if (dto.getStatusEvent() != null &&
                (dto.getStatusEvent().equals("inactivo") || dto.getStatusEvent().equals("cancelado"))) {
            domain.setStatusEvent(dto.getStatusEvent());
        } else if (dto.getEventDate() != null && dto.getEventDate().isBefore(LocalDate.now())) {
            domain.setStatusEvent("pasado");
        } else {
            domain.setStatusEvent("activo");
        }

        Mono<Event> saveEvent = dto.getFlyerFile() != null
                ? uploadFile(dto.getFlyerFile(), "29")
                .flatMap(flyerUrl -> {
                    domain.setFlyerUrl(flyerUrl);
                    return repository.save(domain);
                })
                : repository.save(domain);

        Mono<EventMedia> saveMedia = Mono.just(EventMedia.builder().build());
        if (dto.getImageFile() != null || dto.getSecondImageFile() != null || dto.getVideoUrl() != null) {
            Mono<String> imageUrlMono = dto.getImageFile() != null
                    ? uploadFile(dto.getImageFile(), "29").defaultIfEmpty("")
                    : Mono.just("");
            Mono<String> secondImageUrlMono = dto.getSecondImageFile() != null
                    ? uploadFile(dto.getSecondImageFile(), "29").defaultIfEmpty("")
                    : Mono.just("");

            saveMedia = Mono.zip(imageUrlMono, secondImageUrlMono)
                    .flatMap(tuple -> {
                        String imageUrl = tuple.getT1();
                        String secondImageUrl = tuple.getT2();
                        String videoUrl = dto.getVideoUrl();
                        if (!imageUrl.isEmpty() || !secondImageUrl.isEmpty() || videoUrl != null) {
                            EventMedia media = EventMedia.builder()
                                    .eventId(domain.getEventId())
                                    .imageUrl(imageUrl.isEmpty() ? null : imageUrl)
                                    .secondImageUrl(secondImageUrl.isEmpty() ? null : secondImageUrl)
                                    .videoUrl(videoUrl)
                                    .createdAt(LocalDateTime.now())
                                    .updatedAt(LocalDateTime.now())
                                    .build();
                            return eventMediaRepository.save(media);
                        }
                        return Mono.just(EventMedia.builder().build());
                    });
        }

        return Mono.zip(saveEvent, saveMedia.defaultIfEmpty(EventMedia.builder().build()))
                .map(tuple -> mapper.toResponseDto(tuple.getT1(), tuple.getT2()));
    }

    @Override
    public Mono<PastEventResponseDto> updatePastEvent(Integer id, EventRequestDto dto, UUID updatedBy) {
        return repository.findById(id)
                .filter(event -> event.getStatusEvent().equals("pasado"))
                .switchIfEmpty(Mono.error(new NotFoundException("Event con ID " + id + " no encontrado o no es un evento pasado.")))
                .flatMap(existing -> {
                    if (dto.getDescription() != null) {
                        existing.setDescription(dto.getDescription());
                    }
                    existing.setUpdatedBy(updatedBy);
                    existing.setUpdatedAt(LocalDateTime.now());

                    Mono<Event> saveEvent = repository.save(existing);

                    Mono<EventMedia> saveMedia = eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(id)
                            .defaultIfEmpty(EventMedia.builder().build())
                            .flatMap(existingMedia -> {
                                Mono<String> imageUrlMono = dto.getImageFile() != null
                                        ? uploadFile(dto.getImageFile(), "29").defaultIfEmpty("")
                                        : Mono.just(existingMedia.getImageUrl() != null ? existingMedia.getImageUrl() : "");
                                Mono<String> secondImageUrlMono = dto.getSecondImageFile() != null
                                        ? uploadFile(dto.getSecondImageFile(), "29").defaultIfEmpty("")
                                        : Mono.just(existingMedia.getSecondImageUrl() != null ? existingMedia.getSecondImageUrl() : "");

                                return Mono.zip(imageUrlMono, secondImageUrlMono)
                                        .flatMap(tuple -> {
                                            String rawImageUrl = tuple.getT1();
                                            String rawSecondImageUrl = tuple.getT2();
                                            String imageUrl = rawImageUrl != null ? rawImageUrl : "";
                                            String secondImageUrl = rawSecondImageUrl != null ? rawSecondImageUrl : "";
                                            String videoUrl = dto.getVideoUrl() != null ? dto.getVideoUrl() : existingMedia.getVideoUrl();

                                            if (!imageUrl.isEmpty() || !secondImageUrl.isEmpty() || videoUrl != null) {
                                                EventMedia media = EventMedia.builder()
                                                        .eventId(id)
                                                        .imageUrl(imageUrl.isEmpty() ? null : imageUrl)
                                                        .secondImageUrl(secondImageUrl.isEmpty() ? null : secondImageUrl)
                                                        .videoUrl(videoUrl)
                                                        .createdAt(existingMedia.getCreatedAt() != null ? existingMedia.getCreatedAt() : LocalDateTime.now())
                                                        .updatedAt(LocalDateTime.now())
                                                        .build();
                                                return eventMediaRepository.save(media);
                                            }
                                            return Mono.just(existingMedia);
                                        });
                            });

                    return Mono.zip(saveEvent, saveMedia.defaultIfEmpty(EventMedia.builder().build()))
                            .map(tuple -> mapper.toPastResponseDto(tuple.getT1(), tuple.getT2()));
                });
    }

    @Override
    public Mono<Void> deleteById(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No existe el Event con el ID: " + id)))
                .flatMap(event -> repository.deleteById(id));
    }

    @Override
    public Flux<EventResponseDto> getAll() {
        return repository.findAll()
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toResponseDto(tuple.getT1(), tuple.getT2()))
                )
                .sort(Comparator.comparing(EventResponseDto::getEventId));
    }

    @Override
    public Mono<EventResponseDto> getEvent(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("Event con ID " + id + " no encontrado.")))
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toResponseDto(tuple.getT1(), tuple.getT2()))
                );
    }

    @Override
    public Mono<EventResponseDto> update(Integer id, EventRequestDto dto, UUID updatedBy) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No se encontró el Event con el ID: " + id)))
                .flatMap(existing -> {
                    if (dto.getEventName() != null) {
                        existing.setEventName(dto.getEventName());
                    }
                    if (dto.getIsMainEvent() != null) {
                        existing.setIsMainEvent(dto.getIsMainEvent());
                    }
                    if (dto.getTicketTypeId() != null) {
                        existing.setTicketTypeId(dto.getTicketTypeId());
                    }
                    if (dto.getEventTypeId() != null) {
                        existing.setEventTypeId(dto.getEventTypeId());
                    }
                    if (dto.getEventDate() != null) {
                        existing.setEventDate(dto.getEventDate());
                    }
                    if (dto.getStartDate() != null) {
                        existing.setStartDate(dto.getStartDate());
                    }
                    if (dto.getEndDate() != null) {
                        existing.setEndDate(dto.getEndDate());
                    }
                    if (dto.getVenueId() != null) {
                        existing.setVenueId(dto.getVenueId());
                    }
                    if (dto.getEventUrl() != null) {
                        existing.setEventUrl(dto.getEventUrl());
                    }
                    if (dto.getDescription() != null) {
                        existing.setDescription(dto.getDescription());
                    }
                    if (dto.getPresenter() != null) {
                        existing.setPresenter(dto.getPresenter());
                    }
                    if (dto.getStatusEvent() != null &&
                            (dto.getStatusEvent().equals("inactivo") || dto.getStatusEvent().equals("cancelado"))) {
                        existing.setStatusEvent(dto.getStatusEvent());
                    } else if (dto.getEventDate() != null && dto.getEventDate().isBefore(LocalDate.now())) {
                        existing.setStatusEvent("pasado");
                    } else {
                        existing.setStatusEvent(dto.getStatusEvent() != null ? dto.getStatusEvent() : existing.getStatusEvent());
                    }
                    existing.setUpdatedBy(updatedBy);

                    Mono<Event> saveEvent = dto.getFlyerFile() != null
                            ? uploadFile(dto.getFlyerFile(), "29")
                            .flatMap(flyerUrl -> {
                                existing.setFlyerUrl(flyerUrl);
                                return repository.save(existing);
                            })
                            : repository.save(existing);

                    Mono<EventMedia> saveMedia = Mono.just(EventMedia.builder().build());
                    if (dto.getImageFile() != null || dto.getSecondImageFile() != null || dto.getVideoUrl() != null) {
                        Mono<String> imageUrlMono = dto.getImageFile() != null
                                ? uploadFile(dto.getImageFile(), "29").defaultIfEmpty("")
                                : Mono.just("");
                        Mono<String> secondImageUrlMono = dto.getSecondImageFile() != null
                                ? uploadFile(dto.getSecondImageFile(), "29").defaultIfEmpty("")
                                : Mono.just("");

                        saveMedia = Mono.zip(imageUrlMono, secondImageUrlMono)
                                .flatMap(tuple -> {
                                    String imageUrl = tuple.getT1();
                                    String secondImageUrl = tuple.getT2();
                                    String videoUrl = dto.getVideoUrl();
                                    if (!imageUrl.isEmpty() || !secondImageUrl.isEmpty() || videoUrl != null) {
                                        EventMedia media = EventMedia.builder()
                                                .eventId(id)
                                                .imageUrl(imageUrl.isEmpty() ? null : imageUrl)
                                                .secondImageUrl(secondImageUrl.isEmpty() ? null : secondImageUrl)
                                                .videoUrl(videoUrl)
                                                .createdAt(LocalDateTime.now())
                                                .updatedAt(LocalDateTime.now())
                                                .build();
                                        return eventMediaRepository.save(media);
                                    }
                                    return Mono.just(EventMedia.builder().build());
                                });
                    }

                    return Mono.zip(saveEvent, saveMedia.defaultIfEmpty(EventMedia.builder().build()))
                            .map(tuple -> mapper.toResponseDto(tuple.getT1(), tuple.getT2()));
                });
    }

    @Override
    public Flux<PastEventResponseDto> getPastEvents() {
        return repository.findByStatusEvent("pasado")
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toPastResponseDto(tuple.getT1(), tuple.getT2()))
                )
                .sort(Comparator.comparing(PastEventResponseDto::getEventId));
    }

    @Override
    public Mono<PastEventResponseDto> getPastEventById(Integer id) {
        return repository.findById(id)
                .filter(event -> event.getStatusEvent().equals("pasado"))
                .switchIfEmpty(Mono.error(new NotFoundException("Event con ID " + id + " no encontrado o no es un evento pasado.")))
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toPastResponseDto(tuple.getT1(), tuple.getT2()))
                );
    }

    @Override
    public Flux<EventResponseDto> getCanceledEvents() {
        return repository.findByStatusEvent("cancelado")
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toResponseDto(tuple.getT1(), tuple.getT2()))
                )
                .sort(Comparator.comparing(EventResponseDto::getEventId));
    }

    @Override
    public Flux<EventResponseDto> getActiveEvents() {
        return repository.findByStatusEvent("activo")
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toResponseDto(tuple.getT1(), tuple.getT2()))
                )
                .sort(Comparator.comparing(EventResponseDto::getEventId));
    }

    @Override
    public Flux<EventResponseDto> getOngoingEvents() {
        return repository.findByStatusEvent("en_curso")
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toResponseDto(tuple.getT1(), tuple.getT2()))
                )
                .sort(Comparator.comparing(EventResponseDto::getEventId));
    }

    @Override
    public Flux<EventResponseDto> getInactiveEvents() {
        return repository.findByStatusEvent("inactivo")
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toResponseDto(tuple.getT1(), tuple.getT2()))
                )
                .sort(Comparator.comparing(EventResponseDto::getEventId));
    }

    @Override
    public Flux<PublicEventResponseDto> getPublicEvents() {
        return repository.findByStatusEvent("pasado")
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventTypeRepository.findById(event.getEventTypeId())
                                                .filter(eventType -> "Presencial".equals(eventType.getEventTypeName())),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toPublicResponseDto(tuple.getT1(), tuple.getT2(), tuple.getT3()))
                )
                .sort(Comparator.comparing(PublicEventResponseDto::getEventName));
    }

    @Override
    public Mono<PublicEventResponseDto> getPublicEventById(Integer id) {
        return repository.findById(id)
                .filter(event -> event.getStatusEvent().equals("pasado"))
                .switchIfEmpty(Mono.error(new NotFoundException("Event con ID " + id + " no encontrado o no es un evento pasado.")))
                .flatMap(event ->
                        Mono.zip(
                                        Mono.just(event),
                                        eventTypeRepository.findById(event.getEventTypeId())
                                                .filter(eventType -> "Presencial".equals(eventType.getEventTypeName()))
                                                .switchIfEmpty(Mono.error(new NotFoundException("Event con ID " + id + " no es Presencial."))),
                                        eventMediaRepository.findTopByEventIdOrderByUpdatedAtDesc(event.getEventId()).defaultIfEmpty(EventMedia.builder().build())
                                )
                                .map(tuple -> mapper.toPublicResponseDto(tuple.getT1(), tuple.getT2(), tuple.getT3()))
                );
    }

    @Override
    public Flux<PublicEventWithZonesResponseDto> getPublicEventsWithZones() {
        return Flux.concat(
                        repository.findByStatusEvent("activo"),
                        repository.findByStatusEvent("en_curso")
                )
                .distinct()
                .flatMap(event ->
                        eventZoneRepository.findByEventId(event.getEventId())
                                .collectList()
                                .flatMap(zones ->
                                        eventTypeRepository.findById(event.getEventTypeId())
                                                .flatMap(eventType -> {
                                                    if (event.getVenueId() == null) {
                                                        EventVenue defaultVenue = EventVenue.builder()
                                                                .venueId(null)
                                                                .nameVenue("")
                                                                .country("")
                                                                .city("")
                                                                .address("")
                                                                .build();
                                                        return Mono.just(mapper.toPublicWithZonesResponseDto(event, zones, eventType, defaultVenue));
                                                    } else {
                                                        return eventVenueRepository.findById(event.getVenueId())
                                                                .map(venue -> mapper.toPublicWithZonesResponseDto(event, zones, eventType, venue))
                                                                .defaultIfEmpty(mapper.toPublicWithZonesResponseDto(event, zones, eventType, null));
                                                    }
                                                })
                                                .defaultIfEmpty(mapper.toPublicWithZonesResponseDto(event, zones, null, null))
                                )
                )
                .sort(Comparator.comparing(PublicEventWithZonesResponseDto::getEventName));
    }

    @Override
    public Mono<PublicEventWithZonesResponseDto> getPublicEventWithZonesById(Integer id) {
        return repository.findById(id)
                .filter(event -> event.getStatusEvent().equals("activo") || event.getStatusEvent().equals("en_curso"))
                .switchIfEmpty(Mono.error(new NotFoundException("Event con ID " + id + " no encontrado o no es público.")))
                .flatMap(event ->
                        eventZoneRepository.findByEventId(event.getEventId())
                                .collectList()
                                .flatMap(zones ->
                                        eventTypeRepository.findById(event.getEventTypeId())
                                                .flatMap(eventType -> {
                                                    if (event.getVenueId() == null) {
                                                        EventVenue defaultVenue = EventVenue.builder()
                                                                .venueId(null)
                                                                .nameVenue("")
                                                                .country("")
                                                                .city("")
                                                                .address("")
                                                                .build();
                                                        return Mono.just(mapper.toPublicWithZonesResponseDto(event, zones, eventType, defaultVenue));
                                                    } else {
                                                        return eventVenueRepository.findById(event.getVenueId())
                                                                .map(venue -> mapper.toPublicWithZonesResponseDto(event, zones, eventType, venue))
                                                                .defaultIfEmpty(mapper.toPublicWithZonesResponseDto(event, zones, eventType, null));
                                                    }
                                                })
                                                .defaultIfEmpty(mapper.toPublicWithZonesResponseDto(event, zones, null, null))
                                )
                );
    }

    private Mono<String> uploadFile(FilePart file, String folderNumber) {
        return documentWebClient.post()
                .contentType(org.springframework.http.MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", file)
                        .with("folderNumber", folderNumber))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> response.get("data").toString())
                .onErrorMap(e -> new RuntimeException("No se pudo subir el archivo a S3", e));
    }

    @Override
    public Flux<Event> getEventById(Collection<Integer> eventIds) {
        return repository.findByIdIn(eventIds);
    }

    @Override
    public Mono<PublicEventWithZonesResponseDto> getEventWithZonesById(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("Event con ID " + id + " no encontrado o no es público.")))
                .flatMap(event ->
                        eventZoneRepository.findByEventId(event.getEventId())
                                .collectList()
                                .flatMap(zones ->
                                        eventTypeRepository.findById(event.getEventTypeId())
                                                .flatMap(eventType -> {
                                                    if (event.getVenueId() == null) {
                                                        EventVenue defaultVenue = EventVenue.builder()
                                                                .venueId(null)
                                                                .nameVenue("")
                                                                .country("")
                                                                .city("")
                                                                .address("")
                                                                .build();
                                                        return Mono.just(mapper.toPublicWithZonesResponseDto(event, zones, eventType, defaultVenue));
                                                    } else {
                                                        return eventVenueRepository.findById(event.getVenueId())
                                                                .map(venue -> mapper.toPublicWithZonesResponseDto(event, zones, eventType, venue))
                                                                .defaultIfEmpty(mapper.toPublicWithZonesResponseDto(event, zones, eventType, null));
                                                    }
                                                })
                                                .defaultIfEmpty(mapper.toPublicWithZonesResponseDto(event, zones, null, null))
                                )
                );
    }
}