    package world.inclub.membershippayment.domain.entity;

    import com.fasterxml.jackson.annotation.JsonFormat;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.relational.core.mapping.Column;
    import org.springframework.data.relational.core.mapping.Table;
    import world.inclub.membershippayment.domain.Exceptions.DomainValidationException;

    import java.time.LocalDate;
    import java.time.LocalDateTime;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Table(name = "subscription_beneficiary", schema = "bo_membership")
    public class SubscriptionBeneficiary {

        @Id
        @Column("id_beneficiary")
        private Long idBeneficiary;

        @Column("id_subscripcion")
        private int idSubscription;

        @Column("user_id")
        private int userId;

        @Column("document_type_id")
        private int documentTypeId;

        @Column("residence_country_id")
        private int residenceCountryId;

        @Column("name")
        private String name;

        @Column("lastname")
        private String lastName;

        @Column("gender")
        private String gender;

        @Column("email")
        private String email;

        @Column("nro_document")
        private String nroDocument;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        @Column("age_date")
        private LocalDate ageDate;

        @Column("status")
        private int status = 1;

        @Column("is_adult")
        private String isAdult;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        @Column("creation_date")
        private LocalDateTime creationDate;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        @Column("expiration_date")
        private LocalDateTime expirationDate;

        public void calculateIsAdult(){
            if(this.ageDate != null){
                LocalDate today = LocalDate.now();
                int age = today.getYear() - this.ageDate.getYear();
                if (today.getMonthValue() < this.ageDate.getMonthValue() ||
                        (today.getMonthValue() == this.ageDate.getMonthValue() && today.getDayOfMonth() < this.ageDate.getDayOfMonth())) {
                    age--;
                }
                this.isAdult = (age >= 18) ? "S" : "N";
            } else {
                this.isAdult = "N";
            }
        }

        public void validate() {

            if( this.idSubscription == 0 ) {
                throw new DomainValidationException("El campo idSuscription no puede estar vacío");
            }

            if( this.userId == 0 ) {
                throw new DomainValidationException("El campo userId no puede estar vacío");
            }

            if( this.documentTypeId == 0 ) {
                throw new DomainValidationException("El campo documentId no puede estar vacío");
            }

            if( this.residenceCountryId == 0 ) {
                throw new DomainValidationException("El campo residenceCountryId no puede estar vacío");
            }

            if( this.name == null || this.name.trim().isEmpty() ) {
                throw new DomainValidationException("El campo name no puede estar vacío");
            }

            if( this.lastName == null || this.lastName.trim().isEmpty() ) {
                throw new DomainValidationException("El campo lastName no puede estar vacío");
            }

        }

        public void initialize() {
            if (this.status == 0) {
                this.status = 1;
            }
            if (this.ageDate == null) {
                this.creationDate = LocalDateTime.now();
            }
            calculateIsAdult();
        }
    }
