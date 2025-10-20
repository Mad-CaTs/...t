package world.inclub.appnotification.infraestructure.security.jwt.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import world.inclub.appnotification.infraestructure.security.jwt.beans.DecodedToken;


public class KeolaAuthenticator extends UsernamePasswordAuthenticationToken {

    public KeolaAuthenticator(DecodedToken principal) {
        super(principal, "", principal.getRoles());
    }

    public DecodedToken getAuthData() {
        return (DecodedToken) super.getPrincipal();
    }
}
