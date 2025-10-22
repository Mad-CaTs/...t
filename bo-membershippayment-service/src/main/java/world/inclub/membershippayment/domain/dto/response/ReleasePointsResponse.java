package world.inclub.membershippayment.domain.dto.response;

import lombok.Data;

@Data
public class ReleasePointsResponse {
    private Integer idUser;
    private Integer idPackage;
    private Integer idPackageDetail;

    private Integer releasedPoints;      
    private Integer remainingAssignedPts;
    private Integer paidInstallments;

    private String message;
}
