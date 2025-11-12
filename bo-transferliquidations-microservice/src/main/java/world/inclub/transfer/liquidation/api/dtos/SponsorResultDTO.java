package world.inclub.transfer.liquidation.api.dtos;

import world.inclub.transfer.liquidation.domain.entity.Account;

public record SponsorResultDTO(
        boolean foundInMongo,
        Integer parentId,
        boolean foundInDb,
        Account account
) {}
