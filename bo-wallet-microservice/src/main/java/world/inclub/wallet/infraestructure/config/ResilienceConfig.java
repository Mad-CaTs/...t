package world.inclub.wallet.infraestructure.config;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class ResilienceConfig {

    private static final Logger LOG = LoggerFactory.getLogger(ResilienceConfig.class);
    public static final String CIRCUIT_BREAKER_CONFIG_NAME = "testService";
    public static final String RETRY_CONFIG_NAME = "testService";
    @Bean
    public CircuitBreakerRegistry configureCircuitBreakerRegistry() {
        final CircuitBreakerConfig circuitBreakerConfig = CircuitBreakerConfig.custom()
                .slidingWindowSize(10)
                .minimumNumberOfCalls(4)
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofSeconds(60))
                .permittedNumberOfCallsInHalfOpenState(2)
                .automaticTransitionFromOpenToHalfOpenEnabled(true)
                //.recordException(new RecordFailurePredicate())
                .build();

        CircuitBreakerRegistry circuitBreakerRegistry = CircuitBreakerRegistry.of(circuitBreakerConfig);

        CircuitBreaker circuitBreaker = circuitBreakerRegistry.circuitBreaker(CIRCUIT_BREAKER_CONFIG_NAME);
        circuitBreaker.getEventPublisher()
                .onStateTransition(event -> LOG.info("Circuit breaker {} transitioned from {} to {}",
                        event.getCircuitBreakerName(),
                        event.getStateTransition().getFromState(),
                        event.getStateTransition().getToState()));

        return circuitBreakerRegistry;
    }
    @Bean
    public RetryRegistry configureRetryRegistry() {
        final RetryConfig retryConfig = RetryConfig.custom()
                .maxAttempts(3)
                .waitDuration(Duration.ofSeconds(5))
                //.retryOnException(new RecordFailurePredicate())
                .build();

        RetryRegistry retryRegistry = RetryRegistry.of(retryConfig);
        retryRegistry.retry(RETRY_CONFIG_NAME, retryConfig);

        return retryRegistry;
    }
}
