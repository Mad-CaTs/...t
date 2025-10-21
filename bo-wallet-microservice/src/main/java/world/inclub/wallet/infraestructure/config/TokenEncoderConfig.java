package world.inclub.wallet.infraestructure.config;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;



@Configuration
public class TokenEncoderConfig {

       //Pendiendete de remmplazar cuando Esté el Security
      @Bean
    public TokenEncoder tokenEncoder() {
        return new TokenEncoder();
    }

    public static class TokenEncoder {

private static final String ALGORITHM = "SHA-256";

        public String encode(String rawToken) {
            try {
                MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
                byte[] hash = digest.digest(rawToken.getBytes());
                return Base64.getEncoder().encodeToString(hash);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Error initializing SHA-256 algorithm", e);
            }
        }

        public boolean matches(String rawToken, String encodedToken) {
            return BCrypt.checkpw(rawToken, encodedToken);
        }
    }

}




