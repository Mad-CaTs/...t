package world.inclub.transfer.liquidation.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.UserAccountDto;
import world.inclub.transfer.liquidation.application.service.interfaces.IUserCustomerService;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;
import world.inclub.transfer.liquidation.domain.port.IUserCustomerPort;
import world.inclub.transfer.liquidation.api.dtos.UserUpdateDto;
import world.inclub.transfer.liquidation.infraestructure.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserCustomerServiceImpl implements IUserCustomerService {

    private final IUserCustomerPort iUserCustomerPort;
    private final UserRepository userRepository;

    @Override
    public Mono<UserCustomer> saveUserCustomer(UserAccountDto entity) {
        UserCustomer user = new UserCustomer();
        user.setIdUser(entity.getIdUser().intValue());
        user.setName(entity.getName());
        user.setLastName(entity.getLastName());
        user.setBirthdate(entity.getBirthDate());
        user.setGender(entity.getGender());
        user.setIdNationality(entity.getIdNationality().intValue());
        user.setEmail(entity.getEmail());
        user.setNroDocument(entity.getNroDocument());
        user.setDistrictAddress(entity.getDistrictAddress());
        user.setAddress(entity.getAddress());
        user.setUserName(entity.getUsername());
        user.setPassword(entity.getPassword());
        user.setIdResidenceCountry(entity.getIdResidenceCountry().intValue());
        user.setCivilState(entity.getCivilState());
        user.setBoolDelete(entity.getBoolDelete()!=null?(entity.getBoolDelete()?1:0):0);
        user.setNroPhone(entity.getNroPhone());
        user.setIdDocument(entity.getIdDocument().intValue());
        user.setIdState(entity.getIdState().intValue());
        user.setCreateDate(entity.getCreateDate().atStartOfDay());
        user.setProfilePicture(entity.getProfilePicture());
        user.setCode(entity.getCode());
        return this.getFindById(user.getIdUser())
                .flatMap(p -> this.iUserCustomerPort.updateUserCustomer(p.getIdUser(), Mono.just(user)))
                .switchIfEmpty(this.iUserCustomerPort.saveUserCustomer(user));
    }

    @Override
    public Mono<UserCustomer> getFindById(Integer id) {
        return iUserCustomerPort.getFindById(id);
    }

    @Override
    public Mono<UserCustomer> updateByUsername(String username, UserUpdateDto payload) {
        if (username == null || username.isBlank()) {
            return Mono.empty();
        }
    return userRepository.findByUsername(username)
                .flatMap(u -> iUserCustomerPort.getFindById(u.getId())
                        .flatMap(existing -> {
                            if (payload.getName() != null) existing.setName(payload.getName());
                            if (payload.getLastName() != null) existing.setLastName(payload.getLastName());
                            if (payload.getBirthDate() != null) existing.setBirthdate(payload.getBirthDate());
                            if (payload.getGender() != null && !payload.getGender().isBlank()) {
                                existing.setGender(payload.getGender());
                            }
                            if (payload.getIdNationality() != null) existing.setIdNationality(payload.getIdNationality());
                            if (payload.getEmail() != null) existing.setEmail(payload.getEmail());
                            if (payload.getNroDocument() != null) existing.setNroDocument(payload.getNroDocument());
                            if (payload.getDistrictAddress() != null) existing.setDistrictAddress(payload.getDistrictAddress());
                            if (payload.getAddress() != null) existing.setAddress(payload.getAddress());
                            if (payload.getNewUsername() != null && !payload.getNewUsername().isBlank()) existing.setUserName(payload.getNewUsername());
                            if (payload.getPassword() != null) existing.setPassword(payload.getPassword());
                            if (payload.getIdResidenceCountry() != null) existing.setIdResidenceCountry(payload.getIdResidenceCountry());
                            if (payload.getCivilState() != null) existing.setCivilState(payload.getCivilState());
                            if (payload.getBoolDelete() != null) existing.setBoolDelete(payload.getBoolDelete() ? 1 : 0);
                            if (payload.getNroPhone() != null) existing.setNroPhone(payload.getNroPhone());
                            if (payload.getIdDocument() != null) existing.setIdDocument(payload.getIdDocument());
                            if (payload.getIdState() != null) existing.setIdState(payload.getIdState());
                            if (payload.getCreateDate() != null) existing.setCreateDate(payload.getCreateDate().atStartOfDay());
                            if (payload.getProfilePicture() != null) existing.setProfilePicture(payload.getProfilePicture());
                            if (payload.getCode() != null) existing.setCode(payload.getCode());
                            return iUserCustomerPort.updateUserCustomer(existing.getIdUser(), Mono.just(existing));
                        })
                );
    }

}
