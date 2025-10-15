package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.constants;

import static world.inclub.bonusesrewards.shared.infrastructure.constants.ApiConstants.API_V1;

public class BonusApiPaths {

    public static final String BASE = API_V1 + "/bonus";

    public static class Requirements {
        public static final String BASE = BonusApiPaths.BASE + "/requirements";
    }

    public static class Prequalifications {
        public static final String BASE = BonusApiPaths.BASE + "/prequalifications";
    }

    public static class Classifications {
        public static final String BASE = BonusApiPaths.BASE + "/classifications";
    }
}