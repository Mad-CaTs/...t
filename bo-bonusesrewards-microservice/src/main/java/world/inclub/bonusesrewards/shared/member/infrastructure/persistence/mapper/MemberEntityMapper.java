package world.inclub.bonusesrewards.shared.member.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;
import world.inclub.bonusesrewards.shared.member.infrastructure.persistence.entity.MemberEntity;

@Component
public class MemberEntityMapper {

    public Member toDomain(MemberEntity member) {
        return new Member(
                member.getId(),
                member.getName(),
                member.getLastName(),
                member.getBirthDate(),
                member.getGender(),
                member.getEmail(),
                member.getUsername(),
                member.getPassword(),
                member.getPhoneNumber(),
                member.getAddress(),
                member.getDistrict(),
                member.getNationalityId(),
                member.getResidenceCountryId(),
                member.getDocumentTypeId(),
                member.getDocumentNumber(),
                member.getMaritalStatus(),
                member.getStateId(),
                member.getIsPromoter()
        );
    }

}