package world.inclub.membershippayment.aplication.dao.impl;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.PackageDetailDao;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDetail;
import world.inclub.membershippayment.infraestructure.repository.PackageDetailRepository;

@Repository("packageDetailDao")
public class IPackageDetailDao implements PackageDetailDao {
    private final PackageDetailRepository packageDetailRepository;

    public IPackageDetailDao(PackageDetailRepository packageDetailRepository) {
        this.packageDetailRepository = packageDetailRepository;
    }

    @Override
    public Mono<PackageDetail> getByIdPackageDetail(Long packageDetailId) {
        return packageDetailRepository.findById(packageDetailId);
    }
}
