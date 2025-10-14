package world.inclub.ticket.api.dto;

import lombok.Data;

@Data
public class EventVenueRequestDto {
    private String nameVenue;
    private String country;
    private String city;
    private String address;
    private String latitude;
    private String longitude;
    private Boolean status;
}