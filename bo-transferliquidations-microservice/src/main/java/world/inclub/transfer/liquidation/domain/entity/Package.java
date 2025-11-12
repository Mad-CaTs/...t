package world.inclub.transfer.liquidation.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.AffiliateDTO;
import world.inclub.transfer.liquidation.api.dtos.MembershipDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Package {

    @Field("idPackage")
    private Integer idPackage;

    @Field("idPackageDetail")
    private Integer idPackageDetail;

    @Field("status")
    private Integer status;

    @Field("idMembership")
    private Integer idMembership;

    @Field("points")
    private double points;

    @Field("pointsByFee")
    private double pointsByFee;

    @Field("pay")
    private Integer pay;

    @Field("namePackage")
    private String namePackage;

    public static Package toCastMembership(MembershipDTO membershipDTO) {
        return new Package(
                membershipDTO.getIdPackage(),
                membershipDTO.getIdPackageDetail(),
                membershipDTO.getStatus(),
                membershipDTO.getIdMembership(),
                membershipDTO.getPoints() == null ? 0d : membershipDTO.getPoints().doubleValue(),
                membershipDTO.getPointsByFee() == null ? 0d : membershipDTO.getPointsByFee().doubleValue(),
                membershipDTO.getPay(),
                membershipDTO.getNamePackage()
        );
    }

    public static Mono<Package> toCastMembershipReactive(MembershipDTO membershipDTO) {
        return Mono.fromCallable(() -> toCastMembership(membershipDTO));
    }

    public static Package toCastAffiliate(AffiliateDTO affiliateDTO) {
        Package pakage = new Package();
        MembershipDTO m = affiliateDTO.getMembership();
        if (m != null) {
            pakage.setIdPackage(m.getIdPackage());
            pakage.setIdPackageDetail(m.getIdPackageDetail());
            pakage.setStatus(m.getStatus());
            pakage.setIdMembership(m.getIdMembership());
            pakage.setPoints(m.getPoints() == null ? 0d : m.getPoints().doubleValue());
            pakage.setPointsByFee(m.getPointsByFee() == null ? 0d : m.getPointsByFee().doubleValue());
            pakage.setNamePackage(m.getNamePackage());
        }
        return pakage;
    }

    public static Mono<Package> toCastAffiliateReactive(AffiliateDTO affiliateDTO) {
        return Mono.fromCallable(() -> toCastAffiliate(affiliateDTO));
    }
}
