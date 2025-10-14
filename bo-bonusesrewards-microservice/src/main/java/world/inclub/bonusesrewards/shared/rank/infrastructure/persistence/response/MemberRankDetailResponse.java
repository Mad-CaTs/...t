package world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.response;

import java.time.LocalDate;

public record MemberRankDetailResponse(
        Long socioId,
        Long idRange,
        String rango,
        LocalDate fechaObtencion,
        Integer idRangeResidual,
        String rangoResidual,
        LocalDate fechaObtencionResidual,
        Integer idMaxCompoundRange,
        String maxCompoundRange,
        Integer idMaxResidualRange,
        String maxResidualRange
) {}