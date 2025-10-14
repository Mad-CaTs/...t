package world.inclub.ticket.application.port;

import javax.crypto.SecretKey;

public interface QrCryptoService {

    /**
     * Encrypts the given JSON data using the provided secret key.
     *
     * @param jsonData  The JSON data to be encrypted.
     * @param secretKey The secret key used for encryption.
     * @return The encrypted JSON data as a string.
     */
    String encryptJson(String jsonData, SecretKey secretKey);

    /**
     * Decrypts the given encrypted data using the provided secret key.
     *
     * @param encryptedData The encrypted data to be decrypted.
     * @param secretKey     The secret key used for decryption.
     * @return The decrypted JSON data as a string.
     */
    String decryptJson(String encryptedData, SecretKey secretKey);

}
