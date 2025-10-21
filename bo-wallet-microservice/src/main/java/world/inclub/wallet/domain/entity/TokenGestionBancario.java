package world.inclub.wallet.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.wallet.domain.constant.DatabaseConstants;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.TOKENGESTIONBANCARIA_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class TokenGestionBancario {
    @Id
    @Column("idtokengestionbancaria")
    private Long idTokenGestionBancaria;

    @Column("iduser")
    private Long idUser;

    @Column("codetoken")
    private String codeToken;

    @Column("createdate")
    private LocalDateTime createDate;

    @Column("expirationdate")
    private LocalDateTime expirationDate;

    @Column("istokenvalid")
    private Boolean isTokenValid;


    public TokenGestionBancario (Long idUser,String codeToken){
        this.idUser = idUser;
        this.codeToken = codeToken;
        this.createDate = LocalDateTime.now();
        this.expirationDate = createDate.plusMinutes(15);
        this.isTokenValid = true;
    }
}
