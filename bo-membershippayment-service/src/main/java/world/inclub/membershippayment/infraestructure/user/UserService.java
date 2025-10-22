package world.inclub.membershippayment.infraestructure.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.User;
import world.inclub.membershippayment.infraestructure.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public Mono<User> findById(Integer userId) {
        // Busca por ID (correcto)
        return userRepository.findById(userId);
    }
}
