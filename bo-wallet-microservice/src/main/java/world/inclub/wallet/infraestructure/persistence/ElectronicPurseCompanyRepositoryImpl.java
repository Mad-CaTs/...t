package world.inclub.wallet.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import world.inclub.wallet.domain.port.IElectronicPurseCompanyPort;
import world.inclub.wallet.infraestructure.repository.IElectronicPurseCompanyRepository;

@Repository
@RequiredArgsConstructor
public class ElectronicPurseCompanyRepositoryImpl implements IElectronicPurseCompanyPort {

    private final IElectronicPurseCompanyRepository iElectronicPurseCompanyRepository;

}
