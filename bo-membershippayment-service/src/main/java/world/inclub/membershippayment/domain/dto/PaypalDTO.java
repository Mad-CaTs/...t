package world.inclub.membershippayment.domain.dto;

import lombok.Data;

@Data
public class PaypalDTO {
    private Integer id;
    private Integer idSubscription;
    private Integer idUser;
    private String nroOperation;
    private Integer idMembershipPaydetail;
    private Integer idPayMethod;
}
