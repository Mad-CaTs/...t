package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import org.springframework.data.relational.core.mapping.Column;

import java.util.UUID;

public record CarAssignmentWithClassificationDTO(
        @Column("classification_id") UUID classificationId,
        @Column("car_assignment_id") UUID carAssignmentId
) {}
