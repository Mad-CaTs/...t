package world.inclub.membershippayment.infraestructure.apisExternas.collaborator.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class CollaboratorValidationDetailDTO {

    private boolean collaborator;
    private Long id;
    private String firstName;
    private String lastName;
    private Long companyId;
    private BigDecimal salary;
    private String message;


}