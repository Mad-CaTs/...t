package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.api.dtos.response.UserResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.InfoEmail;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaypalRechargeDTO {

    //paypal recarga
    private BigDecimal subTotal;
    private BigDecimal tasa;
    private BigDecimal comision;
    private BigDecimal totalMount;
    private String paypalTransactionCode;
    private String createdUp;
    //user
    private int idUser;
    private String name;
    private String lastName;
    private String email;
    private String username = "UP9636254";
    private String telefono = "987654254";

    public UserResponse parseToUser(){
        UserResponse userData = new UserResponse(this.idUser, this.name, this.lastName, this.email, this.username, this.username,"");
        return userData;
    }

    public InfoEmail parseToInfo(){
        InfoEmail info = new InfoEmail(this.subTotal, this.tasa, this.comision,this.totalMount, this.paypalTransactionCode,this.createdUp);
        return info;
    }


}
