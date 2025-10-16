package world.inclub.ticket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class AppTicketApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppTicketApplication.class, args);
    }

}
