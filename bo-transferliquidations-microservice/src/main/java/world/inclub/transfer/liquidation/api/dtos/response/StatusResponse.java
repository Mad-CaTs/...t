package world.inclub.transfer.liquidation.api.dtos.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusResponse {

    private int idStatus;
    private String description;
    private String creationUser;
    private Date creationDate;
    private String modificationUser;
    private Date modificationDate;

}
