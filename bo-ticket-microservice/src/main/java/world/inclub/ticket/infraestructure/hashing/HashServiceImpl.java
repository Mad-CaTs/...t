package world.inclub.ticket.infraestructure.hashing;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import world.inclub.ticket.application.port.HashService;

@Service
public class HashServiceImpl implements HashService {

    @Override
    public String hashAndTrim(String input, int length) {
        String hash = DigestUtils.sha256Hex(input);
        return hash.substring(0, Math.min(length, hash.length()));
    }

}
