package world.inclub.wallet.bankAccountWithdrawal.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDTO {
    private Long idUserAdmin;
    private String name;
    private String lastName;
    private String email;
    private String userName;
    private String rolName;
}