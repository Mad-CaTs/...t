package world.inclub.wallet.application.service;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;

import world.inclub.wallet.application.service.interfaces.ITokenGeneratorService;


@Service
public class TokenGeneratorServiceImpl implements ITokenGeneratorService{


    private static final SecureRandom secureRandom = new SecureRandom();
    private static final String ALPHANUMERIC_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    @Override
    public String generateToken() {
        StringBuilder token = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            int randomIndex = secureRandom.nextInt(ALPHANUMERIC_CHARACTERS.length());
            token.append(ALPHANUMERIC_CHARACTERS.charAt(randomIndex));
        }
        return token.toString();
    }
}


