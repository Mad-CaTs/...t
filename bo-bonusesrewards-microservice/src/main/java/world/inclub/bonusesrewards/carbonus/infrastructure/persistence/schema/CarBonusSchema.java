package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema;

import world.inclub.bonusesrewards.shared.infrastructure.persistence.DataBaseConstants;

public class CarBonusSchema {

    public static final String SCHEMA = DataBaseConstants.BONUS_REWARDS_SCHEMA;

    public static class Table {
        public static final String CAR_TABLE = "cars";
        public static final String CAR_ASSIGNMENT_TABLE = "car_assignments";
        public static final String CAR_BRAND_TABLE = "cat_car_brands";
        public static final String CAR_MODEL_TABLE = "cat_car_models";
        public static final String CAR_RANK_BONUS_TABLE = "car_rank_bonuses";
        public static final String CAR_PAYMENT_SCHEDULE_TABLE = "car_payment_schedules";
        public static final String CAR_QUOTATIONS_TABLE = "car_quotations";
        public static final String CAT_DOCUMENT_TYPE_TABLE = "cat_document_types";
        public static final String CAR_ASSIGNMENT_DOCUMENT_TABLE = "car_assignment_documents";
        public static final String CAR_BONUS_APPLICATION_TABLE = "car_bonus_applications";
    }

    public static class View {
        public static final String CAR_ASSIGNMENT_DETAIL_VIEW = "car_assignment_details_view";
        public static final String CAR_ASSIGNMENTS_ACTIVE_VIEW = "car_assignments_active_view";
        public static final String CAR_QUOTATION_DETAIL_VIEW = "car_quotation_details_view";
        public static final String CAR_QUOTATION_SUMMARY_VIEW = "car_quotation_summary_view";
        public static final String CAR_QUOTATION_SELECTED_VIEW = "car_quotation_selected_view";
        public static final String CAR_QUOTATION_PENDING_ASSIGNMENT_VIEW = "car_quotation_pending_assignment_view";
        public static final String CAR_ASSIGNMENT_DOCUMENTS_DETAILS_VIEW = "car_assignment_documents_details_view";
        public static final String CAR_ASSIGNMENT_DOCUMENTS_SUMMARY_VIEW = "car_assignment_documents_summary_view";
    }

}