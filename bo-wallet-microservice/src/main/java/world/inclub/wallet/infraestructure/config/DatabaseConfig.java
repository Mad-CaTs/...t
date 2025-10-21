package world.inclub.wallet.infraestructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;


import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.spi.ConnectionFactoryOptions;

@Configuration
public class DatabaseConfig  extends AbstractR2dbcConfiguration {

    @SuppressWarnings("null")
    @Override
    public ConnectionFactory connectionFactory() {
        return ConnectionFactories.get(ConnectionFactoryOptions.builder()
                .option(ConnectionFactoryOptions.DRIVER, "postgresql")
                .option(ConnectionFactoryOptions.HOST, "postgres.inclub.world")
                .option(ConnectionFactoryOptions.USER, "jvilchez")
                .option(ConnectionFactoryOptions.PASSWORD, "jvilchez")
                .option(ConnectionFactoryOptions.PORT, 15432)
                .option(ConnectionFactoryOptions.DATABASE, "dev-inclub")
                .build());
    }

}

