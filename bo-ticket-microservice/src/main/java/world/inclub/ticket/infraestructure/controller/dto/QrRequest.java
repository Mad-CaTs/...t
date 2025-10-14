package world.inclub.ticket.infraestructure.controller.dto;

import java.util.UUID;

public record QrRequest(
        UUID qrHash
) {}
