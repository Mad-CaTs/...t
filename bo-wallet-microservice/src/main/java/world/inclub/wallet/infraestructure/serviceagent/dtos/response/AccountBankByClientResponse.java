package world.inclub.wallet.infraestructure.serviceagent.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountBankByClientResponse {
    private Integer id;
    private String numberAccount;
    private String nameHolder;
    private String lastNameHolder;
    private String numDocument;

    public String getFullName() {
        return String.format("%s %s",
                nameHolder != null ? nameHolder : "",
                lastNameHolder != null ? lastNameHolder : "").trim();
    }
}
