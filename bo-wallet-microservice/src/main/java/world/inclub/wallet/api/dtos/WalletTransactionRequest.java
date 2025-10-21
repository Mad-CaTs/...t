package world.inclub.wallet.api.dtos;

import java.math.BigDecimal;

public record WalletTransactionRequest(
        Integer senderUserId,
        Integer receiverUserId,
        BigDecimal amount,
        int sendCodeId,
        int receiveCodeId,
        String referenceDataSender,
        String referenceDataReceiver
) {}
