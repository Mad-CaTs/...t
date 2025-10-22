package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDetail;

@Repository
public interface PackageDetailRepository extends ReactiveCrudRepository<PackageDetail, Long> {
}
