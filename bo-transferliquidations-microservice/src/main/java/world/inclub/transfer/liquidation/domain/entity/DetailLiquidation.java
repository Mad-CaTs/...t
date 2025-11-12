package world.inclub.transfer.liquidation.domain.entity;

import java.sql.Timestamp;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.DETAIL_LIQUIDATION, schema = DatabaseConstants.SCHEMA_NAME)
public class DetailLiquidation {

    @Id
    @Column("idDetailLiquidation")
    private Integer idDetailLiquidation;

    @Column("idLiquidation")
    private Integer idLiquidation;

    @Column("idUserOld")
    private Integer idUserOld;

    @Column("lastnameOld")
    private String lastnameOld;

    @Column("nameOld")
    private String nameOld;

    @Column("ageOld")
    private Integer ageOld;

    @Column("birthDateOld")
    private Timestamp birthDateOld;

    @Column("nationalityOld")
    private String nationalityOld;

    @Column("documentTypeOld")
    private String documentTypeOld;

    @Column("civilStatusOld")
    private String civilStatusOld;

    @Column("mailOld")
    private String mailOld;

    @Column("countryResidentOld")
    private String countryResidentOld;

    @Column("cityResidentOld")
    private String cityResidentOld;

    @Column("addressOld")
    private String addressOld;

    @Column("phoneOld")
    private String phoneOld;

    @Column("documentPhotoOld")
    private byte[] documentPhotoOld;

    @Column("idUserNew")
    private Integer idUserNew;

    @Column("lastnameNew")
    private String lastnameNew;

    @Column("nameNew")
    private String nameNew;
    
    @Column("ageNew")
    private Integer ageNew;

    @Column("birthDateNew")
    private Timestamp birthDateNew;

    @Column("nationalityNew")
    private String nationalityNew;

    @Column("documentTypeNew")
    private String documentTypeNew;

    @Column("civilStatusNew")
    private String civilStatusNew;

    @Column("mailNew")
    private String mailNew;

    @Column("countryResidentNew")
    private String countryResidentNew;

    @Column("cityResidentNew")
    private String cityResidentNew;

    @Column("addressNew")
    private String addressNew;

    @Column("phoneNew")
    private String phoneNew;

    @Column("documentPhotoNew")
    private byte[] documentPhotoNew;
    
    @Column("voucherPhoto")
    private byte[] voucherPhoto;
     
    @Column("creationUser")
    private String creationUser;

    @Column("creationDate")
    private Timestamp creationDate;

    @Column("modificationUser")
    private String modificationUser;

    @Column("modificationDate")
    private Timestamp modificationDate;
    
}