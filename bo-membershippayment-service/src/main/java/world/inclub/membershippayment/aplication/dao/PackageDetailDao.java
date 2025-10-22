package world.inclub.membershippayment.aplication.dao;

import reactor.core.publisher.Mono;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDetail;

public interface PackageDetailDao {
    Mono<PackageDetail> getByIdPackageDetail(Long packageDetailId);
}