package world.inclub.transfer.liquidation.infraestructure.kafka.dtos.request;

import lombok.Data;
import world.inclub.transfer.liquidation.api.dtos.UserCustomerDto;

@Data
public class UserEditRequestDto {
    private String username;
    private Integer transferType;
    private Long childId; 
    private Long newUserId;
    private UserCustomerDto userCustomer;
}
