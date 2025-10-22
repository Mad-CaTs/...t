package world.inclub.membershippayment.domain.enums;

public enum SubTypeMethodPayment {

    // Definir los valores del enum con sus respectivos valores.
    Sub_1(1, 1, "BCP", "Ventanilla Lima"),
    Sub_2(2, 1, "BCP", "Agente Provincia"),
    Sub_3(3, 1, "BCP", "Agente Lima"),
    Sub_4(4, 1, "BCP", "Banca Movil"),
    Sub_5(5, 1, "BCP", "Banca por Internet"),
    Sub_6(6, 1, "BCP", "Cuenta BCP Yape"),
    Sub_7(7, 2, "INTERBANK", "Banca Movil"),
    Sub_8(8, 2, "INTERBANK", "Banca por Internet"),
    Sub_9(9, 3, "PAYPAL", "Paypal"),
    Sub_10(12, 1, "BCP", "Ventanilla Provincia"),
    Sub_11(13, 1, "BCP", "Cajero Lima"),
    Sub_12(14, 1, "BCP", "Cajero Provincia"),
    Sub_13(15, 2, "INTERBANK", "Ventanilla Lima"),
    Sub_14(16, 2, "INTERBANK", "Ventanilla Provincia"),
    Sub_15(17, 4, "WALLET", "Wallet"),
    Sub_16(20, 5, "OTROS", "Paypal - Subida comprobante"),
    Sub_17(21, 5, "OTROS", "Payeer - Subida comprobante"),
    Sub_18(22, 6, "DAVIVIENDA", "app davivienda movil"),
    Sub_19(23, 6, "DAVIVIENDA", "portal transaccional"),
    Sub_20(24, 6, "DAVIVIENDA", "ventanilla"),
    Sub_21(25, 7, "BANCOLOMBIA", "Banca Movil"),
    Sub_22(26, 7, "BANCOLOMBIA", "Banca por Internet"),
    Sub_23(27, 7, "BANCOLOMBIA", "Agente Bogota"),
    Sub_24(28, 5, "OTROS", "BCP"),
    Sub_25(29, 5, "OTROS", "INTERBANK"),
    Sub_26(30, 6, "DAVIVIENDA", "corresponsales bancarios"),
    Sub_27(31, 6, "DAVIVIENDA", "daviplata"),
    Sub_28(32, 6, "DAVIVIENDA", "Nequi");

    private final int idSubType;
    private final int idType;
    private final String typeDescription;
    private final String subTypeDescription;

    // Constructor para inicializar los valores
    SubTypeMethodPayment(int idSubType, int idType, String typeDescription, String subTypeDescription) {
        this.idSubType = idSubType;
        this.idType = idType;
        this.typeDescription = typeDescription;
        this.subTypeDescription = subTypeDescription;
    }

    // Método estático para obtener el enum a partir del idSubType
    public static SubTypeMethodPayment fromValue(int idSubType) {
        for (SubTypeMethodPayment type : values()) {
            if (type.idSubType == idSubType) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + idSubType);
    }

    // Getters para acceder a los atributos
    public int getIdSubType() {
        return idSubType;
    }

    public int getIdType() {
        return idType;
    }

    public String getTypeDescription() {
        return typeDescription;
    }

    public String getSubTypeDescription() {
        return subTypeDescription;
    }

    @Override
    public String toString() {
        return String.format("Type: %s, SubType: %s", typeDescription, subTypeDescription);
    }
}

