package world.inclub.ticket.application.dto;

import java.math.BigDecimal;

public record ProcessWalletPaymentCommand (

        Long userId,
        BigDecimal amount,
        String detail

) {}