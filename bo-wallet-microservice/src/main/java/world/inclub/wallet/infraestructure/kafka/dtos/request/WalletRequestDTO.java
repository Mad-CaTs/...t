package world.inclub.wallet.infraestructure.kafka.dtos.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletRequestDTO {

    @JsonProperty("idUser")
    private int idUser;

}
