package world.inclub.bonusesrewards.shared.member.domain.model;

import java.time.LocalDate;

public record Member(
        Long id,
        String name,
        String lastName,
        LocalDate birthDate,
        char gender,
        String email,
        String username,
        String password,
        String phoneNumber,
        String address,
        String district,
        Long nationalityId,
        Long residenceCountryId,
        Long documentTypeId,
        String documentNumber,
        String maritalStatus,
        Long stateId,
        Boolean isPromoter
) {}