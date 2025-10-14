package world.inclub.ticket.infraestructure.pdf;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.io.font.FontProgram;
import com.itextpdf.io.font.FontProgramFactory;
import com.itextpdf.io.util.StreamUtil;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.layout.font.FontProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuples;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;
import world.inclub.ticket.application.port.GenerateQrService;
import world.inclub.ticket.application.port.KeyProvider;
import world.inclub.ticket.application.port.ticket.TicketPdfService;
import world.inclub.ticket.application.service.interfaces.GetEventWithZonesByIdUseCase;
import world.inclub.ticket.domain.model.DocumentType;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.ports.DocumentTypeRepositoryPort;
import world.inclub.ticket.infraestructure.exceptions.BadRequestException;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PdfTicketGenerator implements TicketPdfService {

    private final GenerateQrService generateQrService;
    private final GetEventWithZonesByIdUseCase getEventWithZonesByIdUseCase;
    private final DocumentTypeRepositoryPort documentTypeRepositoryPort;

    @Override
    public Mono<byte[]> generatePdfForTicket(Ticket ticket, Attendee attendee, Payment payment) {
        return Mono.zip(
                        getEventWithZonesByIdUseCase.getEventWithZonesById(ticket.getEventId().intValue()),
                        documentTypeRepositoryPort.findDocumentTypeById(attendee.getDocumentTypeId().intValue())
                )
                .switchIfEmpty(Mono.error(new NotFoundException("Event not found for ticket")))
                .flatMap(tuple2 -> {
                    PublicEventWithZonesResponseDto eventZone = tuple2.getT1();
                    DocumentType documentType = tuple2.getT2();

                    PublicEventWithZonesResponseDto.ZoneDetail zone = eventZone.getZones() == null ? null : eventZone.getZones().stream()
                            .filter(z -> Objects.equals(z.getEventZoneId(), attendee.getEventZoneId()))
                            .findFirst()
                            .orElse(null);

                    if (zone == null) {
                        return Mono.error(new NotFoundException(
                                "Zone id " + attendee.getEventZoneId() + " not found for event " + eventZone.getEventName()
                        ));
                    }

                    String ticketQr = ticket.getTicketUuid().toString();
                    return generateQrService.generateQr(ticketQr)
                            .map(qrBytes -> Tuples.of(qrBytes, eventZone, documentType, zone));
                })
                .publishOn(Schedulers.boundedElastic())
                .handle((tuple, sink) -> {
                    byte[] qrBytes = tuple.getT1();
                    PublicEventWithZonesResponseDto eventZone = tuple.getT2();
                    DocumentType documentType = tuple.getT3();
                    PublicEventWithZonesResponseDto.ZoneDetail zone = tuple.getT4();

                    try {
                        ClassPathResource resource = new ClassPathResource("pdf/ticket/send-ticket.html");
                        String htmlTemplate = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                        String qrBase64 = toBase64(qrBytes);

                        BigDecimal price;

                        switch (payment.getCurrencyType()) {
                            case USD -> price = zone.getPrice();
                            case PEN -> price = zone.getPriceSoles();
                            default -> throw new BadRequestException("Unsupported currency type");
                        }

                        htmlTemplate = htmlTemplate
                                .replace("{{qrImage}}", "data:image/png;base64," + qrBase64)
                                .replace("{{logo}}", PdfConstants.LOGO_URL)
                                .replace("{{footer}}", PdfConstants.FOOTER_IMG_URL)
                                .replace("{{ticketCode}}", ticket.getTicketCode())
                                .replace("{{fullName}}", attendee.getName() + " " + attendee.getLastName())
                                .replace("{{documentType}}", documentType.name())
                                .replace("{{documentNumber}}", attendee.getDocumentNumber())
                                .replace("{{price}}", payment.getCurrencyType().getSymbol() + " " + price.setScale(2, RoundingMode.HALF_UP))
                                .replace("{{eventName}}", eventZone.getEventName())
                                .replace("{{place}}", eventZone.getVenue().getNameVenue());

                        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

                        ConverterProperties props = new ConverterProperties();
                        FontProvider fontProvider = new FontProvider();
                        // Register Roboto fonts from dependency using font programs
                        FontProgram robotoRegular = FontProgramFactory.createFont(StreamUtil.inputStreamToArray(
                                Objects.requireNonNull(getClass().getResourceAsStream("/com/formdev/flatlaf/fonts/roboto/Roboto-Regular.ttf"))
                        ));
                        FontProgram robotoMedium = FontProgramFactory.createFont(StreamUtil.inputStreamToArray(
                                Objects.requireNonNull(getClass().getResourceAsStream("/com/formdev/flatlaf/fonts/roboto/Roboto-Medium.ttf"))
                        ));
                        FontProgram robotoBold = FontProgramFactory.createFont(StreamUtil.inputStreamToArray(
                                Objects.requireNonNull(getClass().getResourceAsStream("/com/formdev/flatlaf/fonts/roboto/Roboto-Bold.ttf"))
                        ));
                        fontProvider.addFont(robotoRegular);
                        fontProvider.addFont(robotoMedium);
                        fontProvider.addFont(robotoBold);
                        props.setFontProvider(fontProvider);

                        HtmlConverter.convertToPdf(htmlTemplate, outputStream, props);
                        sink.next(outputStream.toByteArray());
                    } catch (IOException e) {
                        sink.error(new RuntimeException(e));
                    }
                });
    }


    private String toBase64(byte[] bytes) {
        return Base64.getEncoder().encodeToString(bytes);
    }

}
