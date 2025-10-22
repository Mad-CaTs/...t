package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CoAffiliate {
    private String name ;
    private String lastName ;
    private Integer idDocument ;
    private LocalDate birthDate ;
    private String nroDocument ;
}
