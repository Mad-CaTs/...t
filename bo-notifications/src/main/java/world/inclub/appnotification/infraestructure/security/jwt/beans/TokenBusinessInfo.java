package world.inclub.appnotification.infraestructure.security.jwt.beans;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Collection;

@Data
@RequiredArgsConstructor
@Builder
public class TokenBusinessInfo {
    final String email;
    final Long userId;
    final Collection<KeolaRole> roles;
}
