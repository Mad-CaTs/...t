package world.inclub.ticket.infraestructure.controller.dto;

import jakarta.validation.constraints.NotNull;

public record UserPurchaseRequest(
        @NotNull
        Long userId,

        @NotNull
        PaginationRequest pagination
) {}
