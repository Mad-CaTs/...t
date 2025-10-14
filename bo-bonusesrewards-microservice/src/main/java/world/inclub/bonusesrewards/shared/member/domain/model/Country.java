package world.inclub.bonusesrewards.shared.member.domain.model;

import lombok.Builder;

@Builder(toBuilder = true)
public record Country(
        Long id,
        String isoCode,
        String name,
        String displayName,
        String iso3Code,
        Integer numericCode,
        Integer phoneCode,
        String phoneSymbol,
        String nationality
) {}