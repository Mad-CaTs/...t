package world.inclub.wallet.infraestructure.oauth.config;

public class SecurityConstants {

    public static String[] AUTH_WHITELIST = {
            "/actuator",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/api-docs/**",
            "/assets/**",
            "/webjars/**",
            "/logged-out"
    };
    public static final String ROLES_CLAIM = "roles";

    public static final String DEFAULT_AUTHORITY_PREFIX = "ROLE_";

    private SecurityConstants() {
    }

}
