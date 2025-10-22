package world.inclub.membershippayment.aplication.dao.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.SubscriptionBeneficiaryDao;
import world.inclub.membershippayment.domain.entity.SubscriptionBeneficiary;
import world.inclub.membershippayment.infraestructure.repository.SubscriptionBeneficiaryRepository;

@Repository("subscriptionbeneficiaryDao")
public class ISubscriptionBeneficiaryDao implements SubscriptionBeneficiaryDao {

    @Autowired
    private SubscriptionBeneficiaryRepository subscriptionBeneficiaryRepository;

    @Override
    public Flux<SubscriptionBeneficiary> findAll() {
        return subscriptionBeneficiaryRepository.findAll();
    }

    @Override
    public Mono<SubscriptionBeneficiary> findById(Long id) {
        return subscriptionBeneficiaryRepository.findById(id)
                .switchIfEmpty(
                        Mono.error(new RuntimeException("Error: no se puedo encontrar el Beneficiario con el id: " + id))
                );
    }

    @Override
    public Mono<SubscriptionBeneficiary> save(SubscriptionBeneficiary suscriptionBeneficiary) {
        try{
        suscriptionBeneficiary.calculateIsAdult();
        suscriptionBeneficiary.validate();
        } catch (IllegalArgumentException e){
            return Mono.error(e);
        }

        return subscriptionBeneficiaryRepository.save(suscriptionBeneficiary);
    }

    @Override
    public Mono<Void> deleteById(Long id) {
        return subscriptionBeneficiaryRepository.deleteById(id).switchIfEmpty(
                Mono.error(new RuntimeException("Error: No se pudo eliminar el beneficiiario con id: " + id))
        );
    }

    @Override
    public Flux<SubscriptionBeneficiary> findBySubscriptionId(Long subscriptionId) {
        return subscriptionBeneficiaryRepository.findBySubscriptionId(subscriptionId);
    }

    @Override
    public Flux<SubscriptionBeneficiary> findByUserId(Long userId, Pageable pageable) {
        return subscriptionBeneficiaryRepository.findByUserId(userId, pageable);
    }

    @Override
    public Mono<Integer> countByUserId(Long userId) {
        return subscriptionBeneficiaryRepository.countAllByUserId(userId);
    }
}
