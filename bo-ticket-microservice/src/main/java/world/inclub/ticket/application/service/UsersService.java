package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.LoginRequestDto;
import world.inclub.ticket.api.dto.LoginResponseDto;
import world.inclub.ticket.api.dto.UsersRequestDto;
import world.inclub.ticket.api.dto.UsersResponseDto;
import world.inclub.ticket.api.dto.UserStatusResponseDto;
import world.inclub.ticket.api.dto.UpdateProfileRequestDto;
import world.inclub.ticket.api.dto.CreateUserRequestDto;
import world.inclub.ticket.api.dto.ChangePasswordRequestDto;
import world.inclub.ticket.api.dto.ChangePasswordResponseDto;
import world.inclub.ticket.application.service.interfaces.CreateUsersUseCase;
import world.inclub.ticket.application.service.interfaces.DeleteUsersUseCase;
import world.inclub.ticket.application.service.interfaces.GetAllUsersUseCase;
import world.inclub.ticket.application.service.interfaces.GetUsersUseCase;
import world.inclub.ticket.application.service.interfaces.UpdateUsersUseCase;
import world.inclub.ticket.application.service.interfaces.LoginUsersUseCase;
import world.inclub.ticket.application.service.interfaces.GetUserInfoUseCase;
import world.inclub.ticket.application.service.interfaces.UpdateProfileUseCase;
import world.inclub.ticket.application.service.interfaces.CreateUserUseCase;
import world.inclub.ticket.application.service.interfaces.GetAllDocumentTypesUseCase;
import world.inclub.ticket.application.service.interfaces.ChangePasswordUseCase;
import world.inclub.ticket.domain.model.Users;
import world.inclub.ticket.domain.model.DocumentType;
import world.inclub.ticket.domain.ports.DocumentTypeRepositoryPort;
import world.inclub.ticket.domain.repository.UsersRepository;
import world.inclub.ticket.infraestructure.config.security.JWTUtil;
import world.inclub.ticket.infraestructure.exceptions.DuplicateResourceException;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.api.mapper.UsersMapper;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsersService implements CreateUsersUseCase, GetAllUsersUseCase, GetUsersUseCase, UpdateUsersUseCase, DeleteUsersUseCase, LoginUsersUseCase, GetUserInfoUseCase, UpdateProfileUseCase, CreateUserUseCase, GetAllDocumentTypesUseCase, ChangePasswordUseCase {
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final UsersRepository repository;
    private final DocumentTypeRepositoryPort documentTypeRepositoryPort;
    private final UsersMapper mapper;
    private final JWTUtil jwtUtil;

    @Override
    public Mono<UsersResponseDto> create(UsersRequestDto dto) {
        return validateUniqueFieldsSequentially(dto)
                .then(Mono.defer(() -> {
                    Users domain = mapper.toDomain(dto);
                    return repository.save(domain)
                            .map(mapper::toResponseDto);
                }));
    }

    @Override
    public Mono<Void> deleteById(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("User with ID " + id + " not found.")))
                .flatMap(user -> repository.deleteById(id));
    }

    @Override
    public Flux<UsersResponseDto> getAll() {
        return repository.findAll()
                .map(mapper::toResponseDto)
                .sort(Comparator.comparing(UsersResponseDto::getId));
    }

    @Override
    public Mono<UsersResponseDto> getById(Integer id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("User with ID " + id + " not found.")))
                .map(mapper::toResponseDto);
    }

    @Override
    public Mono<UsersResponseDto> update(Integer id, UsersRequestDto dto, UUID updatedBy) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NotFoundException("User with ID " + id + " not found.")))
                .flatMap(existing -> {
                    existing.setEmail(dto.getEmail());
                    existing.setPassword(dto.getPassword());
                    existing.setSponsor(dto.getSponsor());
                    existing.setFirstName(dto.getFirstName());
                    existing.setLastName(dto.getLastName());
                    existing.setCountry(dto.getCountry());
                    existing.setPhone(dto.getPhone());
                    existing.setDocumentTypeId(dto.getDocumentTypeId());
                    existing.setDocumentNumber(dto.getDocumentNumber());
                    existing.setStatus(dto.getStatus());
                    existing.setUpdatedAt(LocalDateTime.now());
                    
                    return repository.save(existing);
                }).map(mapper::toResponseDto);
    }

    @Override
    public Mono<LoginResponseDto> login(LoginRequestDto dto) {
         String cleanDocument = cleanDocumentNumber(dto.getDocumentNumber());

        return repository.findByDocumentTypeAndDocumentNumber(
                dto.getDocumentTypeId(),
                cleanDocument)              
            
            .switchIfEmpty(Mono.error(new NotFoundException("Usuario no encontrado")))
            
            .filter(user -> passwordEncoder.matches(dto.getPassword(), user.getPassword()))
            .switchIfEmpty(Mono.error(new NotFoundException("Contraseña invalida")))
            
            .filter(user -> user.getStatus())
            .switchIfEmpty(Mono.error(new NotFoundException("Cuenta inactiva")))
            
            .map(this::buildResponse);
    }
    
    private LoginResponseDto buildResponse(Users user) {
        LoginResponseDto response = new LoginResponseDto();
        response.setId(user.getId());
        response.setMessage("Iniciaste sesion correctamente");
        response.setStatus(user.getStatus());
        String token = jwtUtil.generateToken(user.getDocumentNumber());
        response.setAccesToken(token);
        return response;
    }

    private String cleanDocumentNumber(String documentNumber){
        return documentNumber.replaceAll("[\\s.-]", "").trim();
    }

    private Mono<Void> validateUniqueFieldsSequentially(UsersRequestDto dto) {
        String cleanDocument = cleanDocumentNumber(dto.getDocumentNumber());

        return repository.findByEmail(dto.getEmail())
                .hasElement()
                .flatMap(emailExists -> {
                    if (emailExists) {
                        return Mono.error(new DuplicateResourceException("El correo electrónico ya está registrado"));
                    }
                    
                    return repository.findByDocumentTypeAndDocumentNumber(dto.getDocumentTypeId(), cleanDocument)
                            .hasElement()
                            .flatMap(documentExists -> {
                                if (documentExists) {
                                    return Mono.error(new DuplicateResourceException("Este número de documento ya existe"));
                                }
                                return Mono.empty();
                            });
                });
    }

    @Override
    public Mono<UserStatusResponseDto> getUserInfo(Integer userId) {
        return repository.findById(userId)
                .switchIfEmpty(Mono.error(new NotFoundException("Usuario con ID " + userId + " no encontrado.")))
                .flatMap(user -> {
                    if (user.getDocumentTypeId() == null) {
                        return Mono.just(mapper.toStatusResponseDto(user, "No especificado"));
                    }
                    
                    return documentTypeRepositoryPort.findDocumentTypeById(user.getDocumentTypeId())
                            .map(documentType -> mapper.toStatusResponseDto(user, documentType.name()))
                            .defaultIfEmpty(mapper.toStatusResponseDto(user, "No encontrado"));
                });
    }

    @Override
    public Mono<UsersResponseDto> updateProfile(Integer userId, UpdateProfileRequestDto dto, UUID updatedBy) {
        return repository.findById(userId)
                .switchIfEmpty(Mono.error(new NotFoundException("Usuario con ID " + userId + " no encontrado.")))
                .flatMap(existing -> {
                    // Validar unicidad de username si se está cambiando
                    if (dto.getUsername() != null && !dto.getUsername().equals(existing.getUsername())) {
                        return validateUsernameUnique(dto.getUsername())
                                .then(Mono.just(existing));
                    }
                    
                    // Validar unicidad de email si se está cambiando
                    if (dto.getEmail() != null && !dto.getEmail().equals(existing.getEmail())) {
                        return validateEmailUnique(dto.getEmail())
                                .then(Mono.just(existing));
                    }
                    
                    // Validar unicidad de teléfono si se está cambiando
                    if (dto.getPhone() != null && !dto.getPhone().equals(existing.getPhone())) {
                        return validatePhoneUnique(dto.getPhone())
                                .then(Mono.just(existing));
                    }
                    
                    return Mono.just(existing);
                })
                .flatMap(existing -> {
                    // Actualizar campos
                    if (dto.getSponsor() != null) existing.setSponsor(dto.getSponsor());
                    if (dto.getSponsorId() != null) existing.setSponsorId(dto.getSponsorId());
                    if (dto.getUsername() != null) existing.setUsername(dto.getUsername());
                    if (dto.getFirstName() != null) existing.setFirstName(dto.getFirstName());
                    if (dto.getLastName() != null) existing.setLastName(dto.getLastName());
                    if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
                    if (dto.getNationality() != null) existing.setNationality(dto.getNationality());
                    if (dto.getCountry() != null) existing.setCountry(dto.getCountry());
                    if (dto.getDistrict() != null) existing.setDistrict(dto.getDistrict());
                    if (dto.getGender() != null) existing.setGender(dto.getGender());
                    if (dto.getDocumentTypeId() != null) existing.setDocumentTypeId(dto.getDocumentTypeId());
                    if (dto.getDocumentNumber() != null) existing.setDocumentNumber(dto.getDocumentNumber());
                    if (dto.getPhone() != null) existing.setPhone(dto.getPhone());
                    if (dto.getBirthDate() != null) existing.setBirthDate(dto.getBirthDate());
                    if (dto.getAddress() != null) existing.setAddress(dto.getAddress());
                    if (dto.getPromotions() != null) existing.setPromotions(dto.getPromotions());
                    
                    existing.setUpdatedAt(LocalDateTime.now());
                    
                    return repository.save(existing);
                })
                .map(mapper::toResponseDto);
    }

    private Mono<Void> validateUsernameUnique(String username) {
        return repository.findByUsername(username)
                .hasElement()
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new DuplicateResourceException("El username ya está registrado"));
                    }
                    return Mono.empty();
                });
    }

    private Mono<Void> validateEmailUnique(String email) {
        return repository.findByEmail(email)
                .hasElement()
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new DuplicateResourceException("El correo electrónico ya está registrado"));
                    }
                    return Mono.empty();
                });
    }

    private Mono<Void> validatePhoneUnique(String phone) {
        return repository.findByPhone(phone)
                .hasElement()
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new DuplicateResourceException("El número de teléfono ya está registrado"));
                    }
                    return Mono.empty();
                });
    }

    @Override
    public Mono<UsersResponseDto> createUser(CreateUserRequestDto dto, UUID createdBy) {
        return validateCreateUserFields(dto)
                .then(Mono.defer(() -> {
                    Users domain = mapper.toDomain(dto);
                    domain.setCreatedAt(LocalDateTime.now());
                    domain.setUpdatedAt(LocalDateTime.now());
                    
                    return repository.save(domain)
                            .map(mapper::toResponseDto);
                }));
    }

    private Mono<Void> validateCreateUserFields(CreateUserRequestDto dto) {
        return validateUsernameUnique(dto.getUsername())
                .then(validateEmailUnique(dto.getEmail()))
                .then(validatePhoneUnique(dto.getPhone()))
                .then(validateDocumentTypeExists(dto.getDocumentTypeId()))
                .then(validateDocumentUnique(dto.getDocumentTypeId(), dto.getDocumentNumber()));
    }

    private Mono<Void> validateDocumentTypeExists(Integer documentTypeId) {
        if (documentTypeId == null) {
            return Mono.error(new IllegalArgumentException("El tipo de documento es requerido"));
        }
        
        return documentTypeRepositoryPort.findDocumentTypeById(documentTypeId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("El tipo de documento con ID " + documentTypeId + " no existe")))
                .then();
    }

    private Mono<Void> validateDocumentUnique(Integer documentTypeId, String documentNumber) {
        String cleanDocument = cleanDocumentNumber(documentNumber);
        return repository.findByDocumentTypeAndDocumentNumber(documentTypeId, cleanDocument)
                .hasElement()
                .flatMap(exists -> {
                    if (exists) {
                        return Mono.error(new DuplicateResourceException("Este número de documento ya existe"));
                    }
                    return Mono.empty();
                });
    }

    @Override
    public Flux<DocumentType> getAllDocumentTypes() {
        return documentTypeRepositoryPort.findAllDocumentTypes();
    }

    @Override
    public Mono<ChangePasswordResponseDto> changePassword(Integer userId, ChangePasswordRequestDto dto, UUID updatedBy) {
        return repository.findById(userId)
                .switchIfEmpty(Mono.error(new NotFoundException("Usuario con ID " + userId + " no encontrado.")))
                .flatMap(user -> {
                    // Validar contraseña actual
                    if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
                        return Mono.error(new IllegalArgumentException("La contraseña actual es incorrecta"));
                    }
                    
                    // Validar que las nuevas contraseñas coincidan
                    if (!dto.getNewPassword().equals(dto.getRepeatPassword())) {
                        return Mono.error(new IllegalArgumentException("Las contraseñas nuevas no coinciden"));
                    }
                    
                    // Validar que la nueva contraseña sea diferente a la actual
                    if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
                        return Mono.error(new IllegalArgumentException("La nueva contraseña debe ser diferente a la actual"));
                    }
                    
                    // Validar longitud mínima de contraseña
                    if (dto.getNewPassword().length() < 6) {
                        return Mono.error(new IllegalArgumentException("La nueva contraseña debe tener al menos 6 caracteres"));
                    }
                    
                    // Actualizar contraseña
                    user.setPassword(passwordEncoder.encode(dto.getNewPassword().trim()));
                    user.setUpdatedAt(LocalDateTime.now());
                    
                    return repository.save(user)
                            .map(savedUser -> {
                                String message = "Contraseña actualizada exitosamente";
                                if (dto.getCloseOtherSessions() != null && dto.getCloseOtherSessions()) {
                                    message += ". Todas las otras sesiones han sido cerradas";
                                }
                                
                                return ChangePasswordResponseDto.builder()
                                        .message(message)
                                        .success(true)
                                        .sessionsClosed(dto.getCloseOtherSessions() != null && dto.getCloseOtherSessions())
                                        .build();
                            });
                });
    }
}