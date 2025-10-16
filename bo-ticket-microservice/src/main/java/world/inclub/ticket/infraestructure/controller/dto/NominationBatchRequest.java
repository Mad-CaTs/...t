package world.inclub.ticket.infraestructure.controller.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record NominationBatchRequest(
        @NotNull
        Long paymentId,

        @Valid
        @NotNull
        @NotEmpty
        List<NomineeRequest> nomineeRequests
) {
    public record NomineeRequest(
            @NotNull
            UUID ticketUuid,

            @NotNull
            Long documentTypeId,

            @NotBlank
            String documentNumber,

            @NotBlank
            String email,

            @NotBlank
            String name,

            @NotBlank
            String lastName
    ) {
    }
}
