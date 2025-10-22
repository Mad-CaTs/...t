package world.inclub.bonusesrewards.shared.member.domain.model;

import lombok.Builder;

import java.time.LocalDate;

@Builder
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
) {
    public static Member empty() {
        return Member.builder()
                .username("Unknown")
                .name("Unknown")
                .lastName("Unknown")
                .build();
    }
}