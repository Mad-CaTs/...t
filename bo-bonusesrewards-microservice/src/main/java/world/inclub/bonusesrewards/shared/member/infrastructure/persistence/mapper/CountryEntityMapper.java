package world.inclub.bonusesrewards.shared.member.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.member.domain.model.Country;
import world.inclub.bonusesrewards.shared.member.infrastructure.persistence.entity.CountryEntity;

@Component
public class CountryEntityMapper {

    public Country toDomain(CountryEntity country) {
        return new Country(
                country.getId(),
                country.getIsoCode(),
                country.getName(),
                country.getDisplayName(),
                country.getIso3Code(),
                country.getNumericCode(),
                country.getPhoneCode(),
                country.getPhoneSymbol(),
                country.getNationality()
        );
    }

}