package world.inclub.wallet.bankAccountWithdrawal.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditLogDTO {
    private Long id;
    private LocalDateTime createDate;
    private Long userAdminId;
    private String role;
    private Integer type;             // 1 = MODIFICATION, 2 = FILE
    private Long idSolicitudBank;
    private String fileName;
    private Integer recordsCount;
    private String size;
    private Long actionId;

    private String userName;
    private String name;
    private String lastName;
}
