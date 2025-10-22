package world.inclub.membershippayment.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HistoryItemDTO {
    private String dateOfUse;
    private String typeOfRedemption;
    private String redemptionCode;
    private String service;
    private String description;
    private String checkIn;
    private String checkOut;
    private String pointsAmount;
    private String pointsUsed;
}