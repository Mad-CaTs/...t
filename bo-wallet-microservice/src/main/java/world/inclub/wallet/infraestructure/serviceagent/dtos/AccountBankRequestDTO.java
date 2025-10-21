package world.inclub.wallet.infraestructure.serviceagent.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountBankRequestDTO {
    private List<FilterItem> filters;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FilterItem {
        private Integer id;
        private String numberAccount;
        private String fullName;
        private String numDocument;
    }
}