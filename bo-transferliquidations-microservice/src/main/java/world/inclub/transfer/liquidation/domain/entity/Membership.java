package world.inclub.transfer.liquidation.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Memberships")
public class Membership {

    @Id
    private String idMongo;

    @Field("id")
    private Integer id;

    @Field("Membership")
    private List<Package> membership;

}
