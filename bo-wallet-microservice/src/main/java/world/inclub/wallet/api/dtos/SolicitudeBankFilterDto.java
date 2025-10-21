package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudeBankFilterDto {
    private String searchText;
    private String fechaRegistro;
    private List<Integer> periodIds;
    private List<Integer> bankStatusIds;
    private List<Integer> currencyIdBank;
    private List<Integer> reviewStatusId;
    private Long idBank;
}