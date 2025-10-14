package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants;

import static world.inclub.bonusesrewards.shared.infrastructure.constants.ApiConstants.API_V1;

public class CarBonusApiPaths {

    public static final String BASE = API_V1 + "/car-bonus";

    public static class CarsAssignments {
        public static final String BASE = CarBonusApiPaths.BASE + "/assignments";
        public static final String DETAIL = BASE + "/details";
        public static final String ACTIVE = BASE + "/active";
    }

    public static class Brands {
        public static final String BASE = CarBonusApiPaths.BASE + "/brands";
    }

    public static class Models {
        public static final String BASE = CarBonusApiPaths.BASE + "/models";
    }

    public static class RankBonuses {
        public static final String BASE = CarBonusApiPaths.BASE + "/rank-bonuses";
        public static final String DETAIL = BASE + "/details";
    }

    public static class PaymentSchedules {
        public static final String BASE = CarBonusApiPaths.BASE + "/schedules";
    }

    public static class Quotation {
        public static final String BASE = CarBonusApiPaths.BASE + "/quotations";
        public static final String DETAIL = BASE + "/details";
    }

}
