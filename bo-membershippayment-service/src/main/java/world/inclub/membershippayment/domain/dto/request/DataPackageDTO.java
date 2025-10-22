package world.inclub.membershippayment.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PaymentSubType;
import world.inclub.membershippayment.domain.dto.PackageInfo;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataPackageDTO {
    private PackageInfo packageInfo;
    private PaymentSubType paymentSubType;
}
