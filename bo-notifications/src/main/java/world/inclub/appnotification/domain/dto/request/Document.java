package world.inclub.appnotification.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Document {
    private String contract;
    private String benefitPlan;
    private String codeOfEthics;
    private String paymetSchule;
    private String additionalBenefits;
    private String certificate;
    private String rciContract;
    private String promissoryNote;
}
