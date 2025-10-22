package world.inclub.membershippayment.aplication.service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.dto.response.MovementHistoryDTO;
import world.inclub.membershippayment.domain.entity.MovementPoint;
import world.inclub.membershippayment.infraestructure.repository.MovementPointRepository;
import world.inclub.membershippayment.infraestructure.repository.SuscriptionRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class MovementPointService {

    private final MovementPointRepository movementRepository;
    private final SuscriptionRepository suscriptionRepository;


    public Mono<MovementPoint> registerMovement(Long idSuscription,
                                                  String information,
                                                  String membership,
                                                  String portfolio,
                                                  Integer points,
                                                  String status,
                                                  Integer idUser) {

        MovementPoint movement = MovementPoint.builder()
                .idSuscription(idSuscription)
                .information(information)
                .membership(membership)
                .portfolio(portfolio)
                .points(points)
                .status(status)
                .movementDate(LocalDateTime.now())
                .idUser(idUser)
                .build();

        return movementRepository.save(movement);
    }

    public Flux<MovementHistoryDTO> getMovementsByUser(Integer idUser) {
        return movementRepository.findAllByIdUser(idUser)
                .map(this::mapToMovementHistoryDTO);
    }

    private MovementHistoryDTO mapToMovementHistoryDTO(MovementPoint movement) {
        MovementHistoryDTO dto = new MovementHistoryDTO();
        dto.setInformation(movement.getInformation());
        dto.setMembership(movement.getMembership());
        dto.setPortfolio(movement.getPortfolio());

        int pts = movement.getPoints() != null ? movement.getPoints() : 0;
        dto.setPoints((pts >= 0 ? "+" : "") + pts + " pts");

        dto.setStatus(movement.getStatus());

        if (movement.getMovementDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter
                    .ofPattern("dd MMMM yyyy, hh:mm a")
                    .withLocale(new Locale("es","ES"));
            dto.setDate(movement.getMovementDate().format(formatter));
        }

        return dto;
    }



}