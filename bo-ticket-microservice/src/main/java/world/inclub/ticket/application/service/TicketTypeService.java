package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.TicketTypeRequestDTO;
import world.inclub.ticket.api.dto.TicketTypeResponseDTO;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.domain.model.TicketType;
import world.inclub.ticket.domain.repository.TicketTypeRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.api.mapper.TicketTypeMapper;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeService implements CreateTicketTypeUseCase,
        GetAllTicketTypeUseCase,
        GetTicketTypeByIdUseCase,
        UpdateTicketTypeUseCase,
        DeleteTicketTypeUseCase {

    private final TicketTypeRepository ticketTypeRepository;
    private final TicketTypeMapper mapper;

    @Override
    public Mono<TicketTypeResponseDTO> create(TicketTypeRequestDTO dto, UUID userId) {
        TicketType domain = mapper.toDomain(dto);
        domain.setCreatedBy(userId);
        return ticketTypeRepository.save(domain)
                .map(mapper::toResponseDTO);
    }

    @Override
    public Mono<Void> deleteById(Integer id) {
        return ticketTypeRepository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No existe el TicketType con ID " + id)))
                .flatMap(ticket -> ticketTypeRepository.deleteById(id));
    }

    @Override
    public Flux<TicketTypeResponseDTO> getAll() {
        return ticketTypeRepository.findAll()
                .map(mapper::toResponseDTO)
                .sort(Comparator.comparing(TicketTypeResponseDTO::getTicketTypeId));
    }

    @Override
    public Mono<TicketTypeResponseDTO> getById(Integer id) {
        return ticketTypeRepository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("TicketType con ID " + id + " no encontrado.")))
                .map(mapper::toResponseDTO);
    }

    @Override
    public Mono<TicketTypeResponseDTO> updateById(Integer id, TicketTypeRequestDTO ticketTypeRequestDTO, UUID updateBy) {
        return ticketTypeRepository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No se encontró el TicketType con ID " + id)))
                .flatMap(existing -> {
                    existing.setTicketTypeName(ticketTypeRequestDTO.getTicketTypeName());
                    existing.setStatus(ticketTypeRequestDTO.getStatus());
                    existing.setUpdatedAt(LocalDateTime.now());
                    existing.setUpdatedBy(updateBy);
                    return ticketTypeRepository.save(existing);
                })
                .map(mapper::toResponseDTO);
    }
}