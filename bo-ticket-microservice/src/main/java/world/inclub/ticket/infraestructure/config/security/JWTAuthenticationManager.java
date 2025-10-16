package world.inclub.ticket.infraestructure.config.security;

import java.util.ArrayList;

import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.repository.UsersRepository;

@Component
@Primary
public class JWTAuthenticationManager implements ReactiveAuthenticationManager {

    private final JWTUtil jwtUtil;
    private final UsersRepository userService;

    public JWTAuthenticationManager(JWTUtil jwtUtil, UsersRepository userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        String authToken = authentication.getCredentials().toString();
        String documentNumber;

        try {
            documentNumber = jwtUtil.extractUsername(authToken);
        } catch (Exception e) {
            return Mono.empty(); 
        }

        return userService.findByDocumentNumber(documentNumber)
            .map(user -> {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    user.getDocumentNumber(), null, new ArrayList<>());
                return auth;
            });
    }

    public ServerAuthenticationConverter authenticationConverter() {
        return new ServerAuthenticationConverter() {
            @Override
            public Mono<Authentication> convert(ServerWebExchange exchange) {
                String token = exchange.getRequest().getHeaders().getFirst("Authorization");
                if (token != null && token.startsWith("Bearer ")) {
                    token = token.substring(7);
                    return Mono.just(new UsernamePasswordAuthenticationToken(token, token));
                }
                return Mono.empty();
            }
        };
    }
}