package world.inclub.wallet.domain.dictionary;
import java.util.Map;

import org.springframework.stereotype.Component;

import world.inclub.wallet.domain.enums.CodeTypeWalletTransaction;

@Component
public class DictionaryData {
    public static final Map<CodeTypeWalletTransaction, String> DicCodWalletTransactionFullPay = Map.of(
        CodeTypeWalletTransaction.PAGO_CUOTA, "Pago completo de cuota",
        CodeTypeWalletTransaction.COMPRA_SUSCRIPCION_EXTRA, "Compra de suscripción adicional" ,
        CodeTypeWalletTransaction.REGISTRO_SOCIO, "Pago completo de registro socio",
        CodeTypeWalletTransaction.UPGRADE_SUSCRIPCION, "Migración de suscripción",
        CodeTypeWalletTransaction.COMPRA_ENTRADAS_EVENTOS, "Compra de entradas para eventos"
    );

    public static final Map<CodeTypeWalletTransaction, String> DicCodWalletTransactionPartialPay = Map.of(
        CodeTypeWalletTransaction.PAGO_CUOTA, "Pago parcial de cuota",
        CodeTypeWalletTransaction.COMPRA_SUSCRIPCION_EXTRA, "Compra de suscripción adicional, pago parcial" ,
        CodeTypeWalletTransaction.REGISTRO_SOCIO, "Pago de registro socio, pago parcial",
        CodeTypeWalletTransaction.UPGRADE_SUSCRIPCION, "Migración de suscripción, pago parcial"
    );
}
