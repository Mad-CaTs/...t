package world.inclub.wallet.infraestructure.kafka.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BankWithdrawalStatusDto {
    private Long id;
    private String name;
    private String backgroundColor;
    private String fontColor;
}
