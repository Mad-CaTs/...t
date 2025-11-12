package world.inclub.transfer.liquidation.infraestructure.config;

import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactoryOptions;
import static io.r2dbc.spi.ConnectionFactoryOptions.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.r2dbc.core.DatabaseClient;
// Using DatabaseClient directly; R2dbcEntityTemplate can be added later if needed

@Configuration
public class SecondaryR2dbcConfig {

    @Bean
    public ConnectionFactory secondaryConnectionFactory(Environment env) {
        String url = env.getProperty("spring.r2dbc.secondary.url");
        if (url == null || url.isBlank()) {
            throw new IllegalStateException("Missing required property 'spring.r2dbc.secondary.url'");
        }
        String username = env.getProperty("spring.r2dbc.secondary.username");
        String password = env.getProperty("spring.r2dbc.secondary.password");

    // Remove any user/password that might be embedded in the URL query string (drivers reject
    // options named 'user' in the query) and then build ConnectionFactoryOptions.
    String sanitizedUrl = sanitizeRemoveUserPassword(url);

    ConnectionFactoryOptions options = ConnectionFactoryOptions.parse(sanitizedUrl);

    ConnectionFactoryOptions.Builder builder = ConnectionFactoryOptions.builder().from(options);

        if (username != null && !username.isBlank()) {
            builder.option(USER, username);
        }
        if (password != null && !password.isBlank()) {
            builder.option(PASSWORD, password);
        }

        return ConnectionFactories.get(builder.build());
    }

    private String sanitizeRemoveUserPassword(String url) {
        if (url == null) return null;
        String[] parts = url.split("\\?", 2);
        if (parts.length == 1) return url;
        String base = parts[0];
        String query = parts[1];

        StringBuilder out = new StringBuilder();
        String[] pairs = query.split("&");
        boolean first = true;
        for (String p : pairs) {
            if (p == null || p.isBlank()) continue;
            String[] kv = p.split("=", 2);
            String k = kv[0].toLowerCase();
            if ("user".equals(k) || "password".equals(k)) continue;
            if (!first) out.append('&');
            out.append(p);
            first = false;
        }

        return out.length() == 0 ? base : base + "?" + out.toString();
    }

    @Bean
    public DatabaseClient secondaryDatabaseClient(ConnectionFactory secondaryConnectionFactory) {
        return DatabaseClient.builder()
                .connectionFactory(secondaryConnectionFactory)
                .build();
    }

    // If you prefer template-style operations, create a R2dbcEntityTemplate here in future.
}
