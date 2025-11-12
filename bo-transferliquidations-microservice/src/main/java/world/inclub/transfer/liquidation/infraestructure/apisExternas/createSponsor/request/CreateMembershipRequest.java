package world.inclub.transfer.liquidation.infraestructure.apisExternas.createSponsor.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateMembershipRequest {

    // Common known fields for creating a membership / sponsor
    private String username;

    @JsonProperty("userId")
    private Integer userId;

    private String email;

    // package or membership identifier
    private Integer packageId;

    private String sponsorUsername;

    // start date for membership; LocalDate is preferred
    private LocalDate startDate;

    // Flexible container for extra provider-specific fields
    private Map<String, Object> extraData;

}
