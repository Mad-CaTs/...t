package world.inclub.transfer.liquidation.domain.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.TRANSFER, schema = DatabaseConstants.SCHEMA_NAME)
public class Transfer {

	@Id
    @Column("idTransfer")
    private Integer idTransfer;
    
	@Column("idUserOld")
	private Integer idUserOld;

	@Column("idUserNew")
	private Integer idUserNew;
	
	@Column("idPerfil")
	private Integer idPerfil;
	
	@Column("idSponsor")
	private Integer idSponsor;

	@Column("idStatus")
	private Integer idStatus;

	@Column("idTypeTransfer")
	private Integer idTypeTransfer;

	@Column("creationUser")
	private String creationUser;

	@Column("creationDate")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime creationDate = LocalDateTime.now();

	@Column("modificationUser")
	private String modificationUser;

	@Column("modificationDate")
	private LocalDateTime modificationDate;

	@Column("dni_url")
    private String dniUrl;
    
    @Column("declaration_jurada_url")
    private String declarationJuradaUrl;
    
}