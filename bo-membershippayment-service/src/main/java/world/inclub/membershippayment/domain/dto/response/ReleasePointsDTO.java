package world.inclub.membershippayment.domain.dto.response;

import lombok.Data;

@Data
public class ReleasePointsDTO {
    private Integer points;
    private Integer intervalReleaseInstallments;
    private Integer assignedPoints;
    private Integer paidInstallments;
    private String namePackage;
    private String portfolio;
}
