package world.inclub.bonusesrewards;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.r2dbc.config.EnableR2dbcAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableR2dbcAuditing
@EnableScheduling
@SpringBootApplication
public class BonusesrewardsApplication {

    public static void main(String[] args) {
        SpringApplication.run(BonusesrewardsApplication.class, args);
    }

}
