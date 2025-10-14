package world.inclub.bonusesrewards.shared.member.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import world.inclub.bonusesrewards.shared.member.infrastructure.persistence.entity.CountryEntity;

public interface CountryR2dbcRepository
        extends R2dbcRepository<CountryEntity, Long> {
}
