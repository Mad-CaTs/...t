package world.inclub.ticket.application.port;

import javax.crypto.SecretKey;

public interface KeyProvider {

    /**
     * Retrieves the secret key used for cryptographic operations.
     *
     * @return the SecretKey instance
     */
    SecretKey getSecretKey();

}
