package world.inclub.transfer.liquidation.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.PackageDetailUpdatedEventDto;
import world.inclub.transfer.liquidation.application.service.interfaces.IMembershipService;
import world.inclub.transfer.liquidation.domain.entity.Membership;
import world.inclub.transfer.liquidation.domain.port.MembershipPort;

@Service
@RequiredArgsConstructor
public class MembershipService implements IMembershipService {

    private final MembershipPort membershipPort;

    @Override
    public Flux<Membership> getAllMemberships() {
        return membershipPort.getAllMemberships();
    }

    @Override
    public Flux<Membership> getMembershipsByUserId(Integer userId) {
        return membershipPort.findByUserId(userId);
    }

    @Override
    public Mono<Membership> updateMembership(Membership membership) {
        return membershipPort.updateMembership(membership);
    }

    @Override
    public Mono<Membership> transferMembershipToChild(Integer parentId, Integer childId, Integer idMembership) {
        return membershipPort.transferMembership(parentId, childId, idMembership);
    }

    @Override
    public Mono<Void> updateMembershipPointsByPackage(PackageDetailUpdatedEventDto packageDetailUpdatedEvent) {
        return membershipPort.updateMembershipPointsByPackage(packageDetailUpdatedEvent);
    }

    @Override
    public Mono<Membership> saveMembership(Membership membership) {
        return membershipPort.saveMembership(membership);
    }

    @Override
    public Mono<Membership> getMembershipById(Integer id) {
        return membershipPort.findById(id);
    }
}
