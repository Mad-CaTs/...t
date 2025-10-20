package world.inclub.appnotification.infraestructure.security.jwt.beans;

import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

@Data
@Builder
public class KeolaRole implements GrantedAuthority {

	private String name;

	@Override
	public String getAuthority() {
		return this.getName();
	}
}
