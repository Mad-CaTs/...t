package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;
import world.inclub.transfer.liquidation.domain.port.IUserCustomerPort;
import world.inclub.transfer.liquidation.infraestructure.repository.IUserCustomerRepository;

@Repository
@RequiredArgsConstructor
public class UserCustomerRepositoryImpl implements IUserCustomerPort {
    
    private final IUserCustomerRepository iRepository;

    @Override
    public Mono<UserCustomer> saveUserCustomer(UserCustomer entity) {
        return iRepository.save(entity);
    }

    public Mono<UserCustomer> updateUserCustomer(int userCustomerId, final Mono<UserCustomer> userCustomerMono){
        return this.iRepository.findById(userCustomerId)
                .flatMap(p -> userCustomerMono.map(u -> {
                    p.setName(u.getName());
                    p.setLastName(u.getLastName());
                    p.setBirthdate(u.getBirthdate());
                    p.setGender(u.getGender());
                    p.setIdNationality(u.getIdNationality());
                    p.setEmail(u.getEmail());
                    p.setNroDocument(u.getNroDocument());
                    p.setDistrictAddress(u.getDistrictAddress());
                    p.setAddress(u.getAddress());
                    p.setUserName(u.getUserName());
                    p.setPassword(u.getPassword());
                    p.setIdResidenceCountry(u.getIdResidenceCountry());
                    p.setCivilState(u.getCivilState());
                    p.setBoolDelete(u.getBoolDelete());
                    p.setNroPhone(u.getNroPhone());
                    p.setIdDocument(u.getIdDocument());
                    p.setIdState(u.getIdState());
                    p.setCreateDate(u.getCreateDate());
                    p.setProfilePicture(u.getProfilePicture());
                    p.setCode(u.getCode());
                    return p;
                }))
                .flatMap(p -> this.iRepository.save(p));
    }

    @Override
    public Mono<UserCustomer> getFindById(Integer id) {
        return iRepository.getFindById(id);
    }

    @Override
    public Mono<UserCustomer> findByUsername(String username) {
        return iRepository.findByUsername(username);
    }

}
