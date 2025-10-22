package world.inclub.membershippayment.crosscutting.exception.common;

public class PaymentProcessingException extends RuntimeException {

    private  static final long serialVersionUID = 1L;

    public enum ErrorCode {
        WALLET_INSUFFICIENT_FUNDS("WALLET_001", "Fondos insuficientes en la wallet"),
        WALLET_TRANSACTION_FAILED("WALLET_002", "Error en la transacción de wallet"),
        WALLET_USER_NOT_FOUND("WALLET_003", "Usuario no encontrado para transacción wallet"),
        WALLET_INVALID_AMOUNT("WALLET_004", "Monto inválido para transacción wallet"),

        PAYPAL_CONNECTION_ERROR("PAYPAL_001", "Error de conexión con PayPal"),
        PAYPAL_INVALID_OPERATION("PAYPAL_002", "Número de operación PayPal inválido"),
        PAYPAL_PAYMENT_DECLINED("PAYPAL_003", "Pago rechazado por PayPal"),

        VOUCHER_INVALID("VOUCHER_001", "Voucher inválido o expirado"),
        VOUCHER_ALREADY_USED("VOUCHER_002", "Voucher ya utilizado"),
        VOUCHER_INSUFFICIENT_AMOUNT("VOUCHER_003", "Monto insuficiente en voucher"),

        MIXED_PAYMENT_ERROR("MIXED_001", "Error en pago mixto"),
        MIXED_WALLET_PORTION_FAILED("MIXED_002", "Falló la porción wallet del pago mixto"),
        MIXED_VOUCHER_PORTION_FAILED("MIXED_003", "Falló la porción voucher del pago mixto"),

        GENERAL_PROCESSING_ERROR("GENERAL_001", "Error general en procesamiento de pago"),
        TIMEOUT_ERROR("TIMEOUT_001", "Timeout en procesamiento de pago"),
        VALIDATION_ERROR("VALIDATION_001", "Error de validación en datos de pago");

        private final String code;
        private final String description;

        ErrorCode(final String code, final String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }
    }

    private final ErrorCode errorCode;
    private final String userId;
    private final String transactionId;
    private final Double amount;

    public PaymentProcessingException(String message) {
        super(message);
        this.errorCode = ErrorCode.GENERAL_PROCESSING_ERROR;
        this.userId = null;
        this.transactionId = null;
        this.amount = null;
    }

    public PaymentProcessingException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = ErrorCode.GENERAL_PROCESSING_ERROR;
        this.userId = null;
        this.transactionId = null;
        this.amount = null;
    }

    public PaymentProcessingException(ErrorCode errorCode, String message) {
        super(formatMessage(errorCode, message));
        this.errorCode = errorCode;
        this.userId = null;
        this.transactionId = null;
        this.amount = null;
    }

    public PaymentProcessingException(ErrorCode errorCode, String message, Throwable cause) {
        super(formatMessage(errorCode, message), cause);
        this.errorCode = errorCode;
        this.userId = null;
        this.transactionId = null;
        this.amount = null;
    }

    public PaymentProcessingException(ErrorCode errorCode, String message, String userId,
                                      String transactionId, Double amount, Throwable cause) {
        super(formatMessage(errorCode, message));
        this.errorCode = errorCode;
        this.userId = userId;
        this.transactionId = transactionId;
        this.amount = amount;
        initCause(cause);
    }

    private static String formatMessage(ErrorCode errorCode, String customMessage) {
        if (customMessage == null || customMessage.trim().isEmpty()) {
            return String.format("[%s] %s", errorCode.getCode(), errorCode.getDescription());
        }
        return String.format("[%s] %s - %s", errorCode.getCode(), errorCode.getDescription(), customMessage);
    }

    // Getters
    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public String getUserId() {
        return userId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public Double getAmount() {
        return amount;
    }

    public String getContextInfo() {
        StringBuilder context = new StringBuilder();
        context.append("Error Code: ").append(errorCode.getCode()).append("\n");
        context.append("Description: ").append(errorCode.getDescription()).append("\n");

        if (userId != null) {
            context.append("User ID: ").append(userId).append("\n");
        }
        if (transactionId != null) {
            context.append("Transaction ID: ").append(transactionId).append("\n");
        }
        if (amount != null) {
            context.append("Amount: ").append(amount).append("\n");
        }

        return context.toString();
    }

    public boolean isErrorType(ErrorCode errorCode) {
        return this.errorCode == errorCode;
    }

    public boolean isWalletError() {
        return errorCode.getCode().startsWith("WALLET_");
    }

    public boolean isPayPalError() {
        return errorCode.getCode().startsWith("PAYPAL_");
    }

    public boolean isVoucherError() {
        return errorCode.getCode().startsWith("VOUCHER_");
    }

    public boolean isMixedPaymentError() {
        return errorCode.getCode().startsWith("MIXED_");
    }

    public static PaymentProcessingException walletInsufficientFunds(String userId, Double requestedAmount, Double availableAmount) {
        String message = String.format("Fondos insuficientes. Solicitado: %s, Disponible: %s", requestedAmount, availableAmount);
        return new PaymentProcessingException(ErrorCode.WALLET_INSUFFICIENT_FUNDS, message, userId, null, requestedAmount, null);
    }

    public static PaymentProcessingException paypalConnectionError(String transactionId, Throwable cause) {
        return new PaymentProcessingException(ErrorCode.PAYPAL_CONNECTION_ERROR, "Error de conectividad con PayPal",
                null, transactionId, null, cause);
    }

    public static PaymentProcessingException invalidVoucher(String voucherCode, String userId) {
        String message = String.format("Voucher inválido: %s", voucherCode);
        return new PaymentProcessingException(ErrorCode.VOUCHER_INVALID, message, userId, null, null, null);
    }

    public static PaymentProcessingException timeoutError(String userId, String transactionId, String operation) {
        String message = String.format("Timeout en operación: %s", operation);
        return new PaymentProcessingException(ErrorCode.TIMEOUT_ERROR, message, userId, transactionId, null, null);
    }
}
