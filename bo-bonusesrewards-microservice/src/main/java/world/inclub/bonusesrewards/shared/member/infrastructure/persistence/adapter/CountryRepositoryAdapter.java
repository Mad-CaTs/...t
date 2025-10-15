package world.inclub.bonusesrewards.shared.member.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.member.domain.model.Country;
import world.inclub.bonusesrewards.shared.member.domain.port.CountryRepositoryPort;
import world.inclub.bonusesrewards.shared.member.infrastructure.persistence.mapper.CountryEntityMapper;
import world.inclub.bonusesrewards.shared.member.infrastructure.persistence.repository.CountryR2dbcRepository;

@Repository
@RequiredArgsConstructor
public class CountryRepositoryAdapter
        implements CountryRepositoryPort {

    private final CountryR2dbcRepository countryR2dbcRepository;
    private final CountryEntityMapper countryEntityMapper;

    @Override
    public Flux<Country> findByIdIn(Iterable<Long> ids) {
        return countryR2dbcRepository
                .findAllById(ids)
                .map(countryEntityMapper::toDomain);
    }

}
