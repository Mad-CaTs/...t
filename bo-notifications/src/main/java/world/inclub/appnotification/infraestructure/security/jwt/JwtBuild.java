package world.inclub.appnotification.infraestructure.security.jwt;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtBuild {
    private String jwt;
    private String jti;
    private String dateExpired;
}
