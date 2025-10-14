package world.inclub.ticket.api.dto;

import lombok.Data;
import org.springframework.http.codec.multipart.FilePart;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventRequestDto {
    private String eventName;
    private Boolean isMainEvent;
    private Integer ticketTypeId;
    private Integer eventTypeId;
    private LocalDate eventDate;
    private LocalTime startDate;
    private LocalTime endDate;
    private Integer venueId;
    private String eventUrl;
    private String statusEvent;
    private String description;
    private FilePart flyerFile;
    private String presenter;
    private FilePart imageFile;
    private FilePart secondImageFile;
    private String videoUrl;
}