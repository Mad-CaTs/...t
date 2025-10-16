package world.inclub.ticket.infraestructure.pdf.qr;


import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

@Component
public class LogoProvider {
    private final BufferedImage logoImg;

    public LogoProvider(ResourceLoader resourceLoader) throws IOException {
        try (InputStream is = resourceLoader.getResource("classpath:icons/logo.png").getInputStream()) {
            this.logoImg = ImageIO.read(is);
            if (logoImg == null) throw new IllegalStateException("Logo image could not be loaded.");
        }
    }

    public BufferedImage getLogo() {
        return logoImg;
    }
}
