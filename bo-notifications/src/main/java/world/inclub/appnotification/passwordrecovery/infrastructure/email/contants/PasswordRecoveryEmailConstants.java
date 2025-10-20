package world.inclub.appnotification.passwordrecovery.infrastructure.email.contants;

import world.inclub.appnotification.utils.TimeLima;

public class PasswordRecoveryEmailConstants {

    public static final String SUPPORT_EMAIL = "soporte.inclub.01@gmail.com";
    public static final String BANNER_URL = "https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/Keola_correo.jpeg";

    public static String getCurrentYear() {
        return String.valueOf(TimeLima.getLimaDate().getYear());
    }

}
