package world.inclub.membershippayment.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record MultiCodeSubscriptionResponse(
        Long idSubscription,
        Integer idSponsor,
        Integer typeUser,
        String nameSubscription,
        String familyPackageName,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime creationDate,
        Integer idStatus,
        Integer numberQuotas
) {}
