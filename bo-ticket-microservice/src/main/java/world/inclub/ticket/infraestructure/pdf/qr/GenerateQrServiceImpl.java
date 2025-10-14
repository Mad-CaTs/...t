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
                String json = objectMapper.writeValueAsString(data);

                // 2. Configurar qr Code
                Map<EncodeHintType, Object> hints = new HashMap<>();
                hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
                hints.put(EncodeHintType.MARGIN, 1);
                hints.put(EncodeHintType.ERROR_CORRECTION, com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.H);

                QRCodeWriter qrCodeWriter = new QRCodeWriter();
                BitMatrix bitMatrix = qrCodeWriter.encode(json, BarcodeFormat.QR_CODE, size, size, hints);

                BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(qrImage, "PNG", baos);
                return baos.toByteArray();

            } catch (WriterException | IOException e) {
                throw new RuntimeException("Error generating qr code: " + e.getMessage(), e);
            }
        });
    }

}
