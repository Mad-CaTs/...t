package world.inclub.appnotification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableKafka
public class AppnotificationApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppnotificationApplication.class, args);
	}

}
