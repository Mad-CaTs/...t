package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.SeatTypeRequestDto;
import world.inclub.ticket.api.dto.SeatTypeResponseDTO;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.domain.model.SeatType;
import world.inclub.ticket.domain.repository.SeatTypeRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.api.mapper.SeatTypeMapper;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SeatTypeService implements CreateSeatTypeUseCase,
        GetAllSeatTypeUseCase,
        GetSeatTypeByIdUseCase,
        UpdateSeatTypeUseCase,
        DeleteSeatTypeUseCase {

    private final SeatTypeRepository repository;
    private final SeatTypeMapper mapper;

    @Override
    public Mono<SeatTypeResponseDTO> create(SeatTypeRequestDto dto, UUID userId) {
        SeatType domain = mapper.toDomain(dto);
        domain.setCreatedBy(userId);
        return repository.save(domain)
                .map(mapper::toResponseDto);
    }

    @Override
    public Mono<Void> delete(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No existe el SeatType con ID " + id)))
                .flatMap(seat -> repository.deleteById(id));
    }

    @Override
    public Flux<SeatTypeResponseDTO> getAll() {
        return repository.findAll()
                .map(mapper::toResponseDto)
                .sort(Comparator.comparing(SeatTypeResponseDTO::getSeatTypeId));
    }

    @Override
    public Mono<SeatTypeResponseDTO> getById(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("SeatType con ID " + id + " no encontrado.")))
                .map(mapper::toResponseDto);
    }

    @Override
    public Mono<SeatTypeResponseDTO> updateById(Integer id, SeatTypeRequestDto dto, UUID updatedBy) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("No se encontró el SeatType con Id: " + id)))
                .flatMap(existing -> {
                    existing.setSeatTypeName(dto.getSeatTypeName());
                    existing.setStatus(dto.getStatus());
                    existing.setUpdatedAt(LocalDateTime.now());
                    existing.setUpdatedBy(updatedBy);
                    return repository.save(existing);
                })
                .map(mapper::toResponseDto);
    }
}