package world.inclub.ticket.infraestructure.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.port.CloudStorageService;
import world.inclub.ticket.application.port.ticket.TicketStorageService;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TicketStorageServiceImpl implements TicketStorageService {

    private final CloudStorageService cloudStorageService;
    private final StorageProperties storageProperties;

    @Override
    public Mono<String> saveTicket(byte[] pdfBytes) {
        MultipartFile file = null;
        try {
            file = new MockMultipartFile(
                    "ticket.pdf",
                    "ticket.pdf",
                    "application/pdf",
                    new ByteArrayInputStream(pdfBytes)
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return cloudStorageService.saveMultiPart(file, storageProperties.ticketsFolder());
    }

}
