package world.inclub.appnotification.infraestructure.security.config;

import lombok.extern.log4j.Log4j2;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.infraestructure.security.jwt.JwtUtils;
import world.inclub.appnotification.infraestructure.security.jwt.exception.TokenJwtException;
import world.inclub.appnotification.infraestructure.security.jwt.security.KeolaAuthenticator;

@Log4j2
@Component
public class AuthTokenFilter implements ServerSecurityContextRepository {

    final JwtUtils jwtUtils;
    final String headerAuthorization;

    public AuthTokenFilter(JwtUtils jwtUtils, @Value("${keola.jwt.header-authorization}") String headerAuthorization) {
        this.jwtUtils = jwtUtils;
        this.headerAuthorization = headerAuthorization;
    }

    @Override
    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Mono<SecurityContext> load(ServerWebExchange swe) {
        return Mono.justOrEmpty(swe.getRequest().getHeaders().getFirst(this.headerAuthorization))
                .filter(authHeader -> authHeader.startsWith("Bearer "))
                .flatMap(authHeader -> {
                    String authToken = authHeader.substring(7);
                    try {
                        return jwtUtils.parseToken(authToken).map(info -> {
                            KeolaAuthenticator authentication = new KeolaAuthenticator(info);
                            SecurityContext securityContext = SecurityContextHolder.getContext();
                            securityContext.setAuthentication(authentication);
                            return securityContext;
                        });
                    } catch (InvalidJwtException | TokenJwtException e) {
                        return Mono.error(e);
                    }
                });
    }
}