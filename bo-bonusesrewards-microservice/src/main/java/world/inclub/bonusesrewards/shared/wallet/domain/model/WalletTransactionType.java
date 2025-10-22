package world.inclub.bonusesrewards.shared.wallet.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum WalletTransactionType {

    PAGO_CUOTA(2L, "Pago de Mi Cuota"),
    DESCUENTO_INCLUB(19L, "Descuento de Inclub"),
    RECARGA_WALLET(41L, "Recarga de Wallet");

    private final Long id;
    private final String description;

    public static WalletTransactionType fromId(Long id) {
        for (WalletTransactionType type : values()) {
            if (type.getId().equals(id)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid WalletTransactionType id: " + id);
    }

}
