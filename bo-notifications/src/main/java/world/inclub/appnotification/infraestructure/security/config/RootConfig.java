package world.inclub.appnotification.infraestructure.security.config;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import world.inclub.appnotification.infraestructure.security.jwt.service.JwtService;

@Configuration
public class RootConfig {

    @Bean
    JwtService jwtService(@Value("${keola.jwt.secret}") String secret, @Value("${keola.jwt.key}") String key) {
        return new JwtService(secret, key);
    }

    @Bean
    Gson mapper() {
        Gson mapper = new Gson();
        return mapper;
    }
}