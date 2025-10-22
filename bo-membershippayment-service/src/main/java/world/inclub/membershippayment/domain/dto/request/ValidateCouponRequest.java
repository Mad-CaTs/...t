package world.inclub.membershippayment.domain.dto.request;

import lombok.Data;

@Data
public class ValidateCouponRequest {
    private String couponCode;
    private Integer packageId;
    private Integer companyId;
    private Double salary;
}
