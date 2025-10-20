package world.inclub.appnotification.infraestructure.security.jwt;

import org.jose4j.jwt.consumer.InvalidJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.infraestructure.security.jwt.beans.DecodedToken;
import world.inclub.appnotification.infraestructure.security.jwt.beans.TokenBusinessInfo;
import world.inclub.appnotification.infraestructure.security.jwt.exception.TokenJwtException;
import world.inclub.appnotification.infraestructure.security.jwt.service.JwtService;

import java.util.Collections;
import java.util.UUID;

@Component
public class JwtUtils {

  @Autowired
  private JwtService jwtService;
  @Value("${keola.jwt.subject}")
  private String subject;

  @Value("${keola.jwt.expirationMs}")
  private Long jwtExpirationMs;

  public Mono<JwtBuild> generateJwtToken(DecodedToken userJwtDTO) {
    return Mono.fromCallable(() -> {
      TokenBusinessInfo info = TokenBusinessInfo.builder()
              .email(userJwtDTO.getEmail())
              .userId(userJwtDTO.getUserId())
              .roles(userJwtDTO.getRoles() == null ? Collections.emptyList() : userJwtDTO.getRoles())
              .build();

      String jti = UUID.randomUUID().toString();
      String accessToken = jwtService.buildJWT(info, subject, jti, 0, jwtExpirationMs, 0);
      String accessTokenEncripted = jwtService.encryptJWE(accessToken);
      return JwtBuild.builder().jwt(accessTokenEncripted).jti(jti).dateExpired(getDateExpiredTocken()).build();
    });
  }

  private String getDateExpiredTocken() {
    java.time.Instant expirationInstant = java.time.Instant.now().plusMillis(jwtExpirationMs);
    java.time.ZonedDateTime expirationDateTime = java.time.ZonedDateTime.ofInstant(expirationInstant, java.time.ZoneId.systemDefault());

    java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    return expirationDateTime.format(formatter);
  }

  public Mono<DecodedToken> parseToken(String jwe) throws InvalidJwtException, TokenJwtException {
    return Mono.just(jwtService.decodeJWT(jwe));
  }
}