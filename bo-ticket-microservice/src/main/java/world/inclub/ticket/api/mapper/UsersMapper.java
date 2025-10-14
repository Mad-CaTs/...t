package world.inclub.ticket.api.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.UsersRequestDto;
import world.inclub.ticket.api.dto.UsersResponseDto;
import world.inclub.ticket.api.dto.UserStatusResponseDto;
import world.inclub.ticket.api.dto.UpdateProfileRequestDto;
import world.inclub.ticket.api.dto.CreateUserRequestDto;
import world.inclub.ticket.domain.model.Users;
import world.inclub.ticket.domain.entity.UsersEntity;

@Component
public class UsersMapper {
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Users toDomain(UsersEntity entity) {
        if (entity == null) return null;
        return Users.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .sponsor(entity.getSponsor())
                .sponsorId(entity.getSponsorId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .country(entity.getCountry())
                .phone(entity.getPhone())
                .documentTypeId(entity.getDocumentTypeId())
                .documentNumber(entity.getDocumentNumber())
                .status(entity.getStatus())
                .promotions(entity.getPromotions())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .username(entity.getUsername())
                .nationality(entity.getNationality())
                .district(entity.getDistrict())
                .gender(entity.getGender())
                .birthDate(entity.getBirthDate())
                .address(entity.getAddress())
                .build();
    }

    public UsersEntity toEntity(Users domain) {
        if (domain == null) return null;
        return UsersEntity.builder()
                .id(domain.getId())
                .email(domain.getEmail())
                .password(domain.getPassword())
                .sponsor(domain.getSponsor())
                .sponsorId(domain.getSponsorId())
                .firstName(domain.getFirstName())
                .lastName(domain.getLastName())
                .country(domain.getCountry())
                .phone(domain.getPhone())
                .promotions(domain.getPromotions())   
                .documentTypeId(domain.getDocumentTypeId())
                .documentNumber(domain.getDocumentNumber())
                .status(domain.getStatus())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .username(domain.getUsername())
                .nationality(domain.getNationality())
                .district(domain.getDistrict())
                .gender(domain.getGender())
                .birthDate(domain.getBirthDate())
                .address(domain.getAddress())
                .build();
    }

    public Users toDomain(UsersRequestDto dto) {
        if (dto == null) return null;
        return Users.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword().trim()))
                .sponsor(dto.getSponsor())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .country(dto.getCountry())
                .phone(dto.getPhone())
                .documentTypeId(dto.getDocumentTypeId())
                .documentNumber(dto.getDocumentNumber())
                .promotions(dto.getPromotions())
                .status(dto.getStatus())
                .build();
    }

    public Users toDomain(UpdateProfileRequestDto dto) {
        if (dto == null) return null;
        return Users.builder()
                .sponsor(dto.getSponsor())
                .sponsorId(dto.getSponsorId())
                .username(dto.getUsername())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .nationality(dto.getNationality())
                .country(dto.getCountry())
                .district(dto.getDistrict())
                .gender(dto.getGender())
                .documentTypeId(dto.getDocumentTypeId())
                .documentNumber(dto.getDocumentNumber())
                .phone(dto.getPhone())
                .birthDate(dto.getBirthDate())
                .address(dto.getAddress())
                .promotions(dto.getPromotions())
                .build();
    }

    public Users toDomain(CreateUserRequestDto dto) {
        if (dto == null) return null;
        return Users.builder()
                .sponsor(dto.getSponsor())
                .sponsorId(dto.getSponsorId())
                .username(dto.getUsername())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword().trim()))
                .nationality(dto.getNationality())
                .country(dto.getCountry())
                .district(dto.getDistrict())
                .gender(dto.getGender())
                .documentTypeId(dto.getDocumentTypeId())
                .documentNumber(dto.getDocumentNumber())
                .phone(dto.getPhone())
                .birthDate(dto.getBirthDate())
                .address(dto.getAddress())
                .promotions(dto.getPromotions())
                .status(dto.getStatus() != null ? dto.getStatus() : true)
                .build();
    }

    public UsersResponseDto toResponseDto(Users domain) {
        if (domain == null) return null;
        UsersResponseDto response = new UsersResponseDto();
        response.setId(domain.getId());
        response.setEmail(domain.getEmail());
        response.setSponsor(domain.getSponsor());
        response.setSponsorId(domain.getSponsorId());
        response.setUsername(domain.getUsername());
        response.setFirstName(domain.getFirstName());
        response.setLastName(domain.getLastName());
        response.setNationality(domain.getNationality());
        response.setCountry(domain.getCountry());
        response.setDistrict(domain.getDistrict());
        response.setGender(domain.getGender());
        response.setDocumentTypeId(domain.getDocumentTypeId());
        response.setDocumentNumber(domain.getDocumentNumber());
        response.setPhone(domain.getPhone());
        response.setBirthDate(domain.getBirthDate());
        response.setAddress(domain.getAddress());
        response.setPromotions(domain.getPromotions());
        response.setStatus(domain.getStatus());
        return response;
    }

    public UsersResponseDto buildResponse(Users user) {
        UsersResponseDto response = new UsersResponseDto();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setSponsor(user.getSponsor());
        response.setSponsorId(user.getSponsorId());
        response.setUsername(user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setNationality(user.getNationality());
        response.setCountry(user.getCountry());
        response.setDistrict(user.getDistrict());
        response.setGender(user.getGender());
        response.setDocumentTypeId(user.getDocumentTypeId());
        response.setDocumentNumber(user.getDocumentNumber());
        response.setPhone(user.getPhone());
        response.setBirthDate(user.getBirthDate());
        response.setAddress(user.getAddress());
        response.setPromotions(user.getPromotions());
        response.setStatus(user.getStatus());
        return response;
    }

    public UserStatusResponseDto toStatusResponseDto(Users user, String documentTypeName) {
        if (user == null) {
            return null;
        }
        
        String fullName = "";
        if (user.getFirstName() != null) {
            fullName = user.getFirstName();
        }
        if (user.getLastName() != null) {
            fullName += (fullName.isEmpty() ? "" : " ") + user.getLastName();
        }
        
        return UserStatusResponseDto.builder()
                .fullName(fullName)
                .documentNumber(user.getDocumentNumber())
                .documentTypeName(documentTypeName != null ? documentTypeName : "No especificado")
                .build();
    }
}