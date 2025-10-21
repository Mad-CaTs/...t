package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import world.inclub.wallet.domain.entity.ElectronicPurseCompany;

public interface IElectronicPurseCompanyRepository extends ReactiveCrudRepository<ElectronicPurseCompany,Long>{

}
