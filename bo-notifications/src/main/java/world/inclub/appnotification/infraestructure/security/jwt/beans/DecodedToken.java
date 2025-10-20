package world.inclub.appnotification.infraestructure.security.jwt.beans;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

@Builder
@Getter
@RequiredArgsConstructor
public class DecodedToken {

    final String email;
    final Long userId;
    final String jti;
    final Collection<KeolaRole> roles;

    public DecodedToken(JwtClaims jwtClaims) throws MalformedClaimException {
        jti = jwtClaims.getClaimValueAsString("jti");
        email = jwtClaims.getClaimValueAsString("email");
        userId = Long.valueOf(jwtClaims.getClaimValueAsString("userId"));
        if(jwtClaims.getStringListClaimValue("scope") != null) {
            roles = jwtClaims.getStringListClaimValue("scope").stream().map((role) -> KeolaRole.builder().name(role).build()).collect(Collectors.toList());
        } else {
            roles = Collections.<KeolaRole>emptyList();
        }
    }

}
