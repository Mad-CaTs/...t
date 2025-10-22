package world.inclub.membershippayment.domain.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.dto.Membership;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
public class AffiliateDTO {
   // private Integer id;
    private Integer idSponsor;
    private UserResponse userSon;
    private LocalDateTime dateAffiliate;
    private Membership membership;
    private Integer statusSon;

    public AffiliateDTO(Integer idSponsor, UserResponse userSon, LocalDateTime dateAffiliate, Membership membership, Integer statusSon) {
    }
}