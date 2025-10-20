package world.inclub.appnotification.shared.infrastructure.constants;

import world.inclub.appnotification.utils.TimeLima;

public class EmailConstants {

    public static final String SUPPORT_EMAIL = "soporte.inclub.01@gmail.com";
    public static final String LOGO_WHITE_URL = "https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/logo_white.png";

    public static String getCurrentYear() {
        return String.valueOf(TimeLima.getLimaDate().getYear());
    }

}
