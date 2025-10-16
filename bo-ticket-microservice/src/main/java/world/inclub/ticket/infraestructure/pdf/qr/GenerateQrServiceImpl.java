package world.inclub.ticket.infraestructure.pdf.qr;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.port.GenerateQrService;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GenerateQrServiceImpl implements GenerateQrService {

    private final ObjectMapper objectMapper;
    private final Integer size = 500;
    private final LogoProvider logoProvider;

    @Override
    public Mono<byte[]> generateQr(Object data) {
        return Mono.fromCallable(() -> {
            try {
                BufferedImage logoImg = logoProvider.getLogo();
                // 1. Convertir objeto a JSON
                String json = objectMapper.writeValueAsString(data);

                // 2. Configurar qr Code
                Map<EncodeHintType, Object> hints = new HashMap<>();
                hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
                hints.put(EncodeHintType.MARGIN, 1);
                hints.put(EncodeHintType.ERROR_CORRECTION, com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.H);

                QRCodeWriter qrCodeWriter = new QRCodeWriter();
                BitMatrix bitMatrix = qrCodeWriter.encode(json, BarcodeFormat.QR_CODE, size, size, hints);

                BufferedImage qrRaw = MatrixToImageWriter.toBufferedImage(bitMatrix);
                BufferedImage qrImage = new BufferedImage(qrRaw.getWidth(), qrRaw.getHeight(), BufferedImage.TYPE_INT_ARGB);
                Graphics2D g = qrImage.createGraphics();
                g.drawImage(qrRaw, 0, 0, null);
                g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);

                int logoWidth = qrImage.getWidth() / 6;
                int logoHeight = qrImage.getHeight() / 6;
                int posX = (qrImage.getWidth() - logoWidth) / 2;
                int posY = (qrImage.getHeight() - logoHeight) / 2;

                g.setComposite(AlphaComposite.SrcOver);
                g.drawImage(logoImg, posX, posY, logoWidth, logoHeight, null);
                g.dispose();

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(qrImage, "PNG", baos);
                return baos.toByteArray();

            } catch (WriterException | IOException e) {
                throw new RuntimeException("Error generating qr code: " + e.getMessage(), e);
            }
        });
    }

}
