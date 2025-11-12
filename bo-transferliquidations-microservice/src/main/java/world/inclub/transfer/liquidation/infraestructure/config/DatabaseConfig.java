package world.inclub.transfer.liquidation.infraestructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;

import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.spi.ConnectionFactoryOptions;


@Configuration
public class DatabaseConfig extends AbstractR2dbcConfiguration {

    @Value("${spring.r2dbc.url}")
    private String r2dbcUrl;

    @Value("${spring.r2dbc.username}")
    private String r2dbcUser;

    @Value("${spring.r2dbc.password}")
    private String r2dbcPassword;

    @Override
    public ConnectionFactory connectionFactory() {
        if (r2dbcUrl == null || !r2dbcUrl.startsWith("r2dbc:postgresql://")) {
            throw new IllegalStateException("Invalid or missing spring.r2dbc.url, expected scheme r2dbc:postgresql://...");
        }

        String withoutScheme = r2dbcUrl.substring("r2dbc:postgresql://".length());
        String hostPart;
        String database = "";
        int slashIdx = withoutScheme.indexOf('/');
        if (slashIdx >= 0) {
            hostPart = withoutScheme.substring(0, slashIdx);
            database = withoutScheme.substring(slashIdx + 1);
        } else {
            hostPart = withoutScheme;
        }

        String host;
        int port = 5432;
        if (hostPart.contains(":")) {
            String[] hp = hostPart.split(":", 2);
            host = hp[0];
            try {
                port = Integer.parseInt(hp[1]);
            } catch (NumberFormatException nfe) {
                throw new IllegalStateException("Invalid port in spring.r2dbc.url: " + hp[1]);
            }
        } else {
            host = hostPart;
        }

        if (host == null || host.isBlank() || database.isBlank()) {
            throw new IllegalStateException("spring.r2dbc.url must include host and database: r2dbc:postgresql://host:port/database");
        }

        return ConnectionFactories.get(ConnectionFactoryOptions.builder()
                .option(ConnectionFactoryOptions.DRIVER, "postgresql")
                .option(ConnectionFactoryOptions.HOST, host)
                .option(ConnectionFactoryOptions.PORT, port)
                .option(ConnectionFactoryOptions.DATABASE, database)
                .option(ConnectionFactoryOptions.USER, r2dbcUser)
                .option(ConnectionFactoryOptions.PASSWORD, r2dbcPassword)
                .build());
    }

}

