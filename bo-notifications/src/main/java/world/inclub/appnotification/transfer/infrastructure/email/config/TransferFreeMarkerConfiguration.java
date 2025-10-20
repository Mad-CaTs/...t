package world.inclub.appnotification.transfer.infrastructure.email.config;

import freemarker.cache.ClassTemplateLoader;
import freemarker.template.TemplateExceptionHandler;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TransferFreeMarkerConfiguration {

    @Bean(name = "transferFreeMarkerConfiguration")
    @ConditionalOnMissingBean(name = "transferFreeMarkerConfiguration")
    public freemarker.template.Configuration transferFreeMarkerConfiguration() {
        freemarker.template.Configuration cfg = new freemarker.template.Configuration(freemarker.template.Configuration.VERSION_2_3_31);
        ClassTemplateLoader loader = new ClassTemplateLoader(Thread.currentThread().getContextClassLoader(), "templates");
        cfg.setTemplateLoader(loader);
        cfg.setDefaultEncoding("UTF-8");
        cfg.setLocale(java.util.Locale.forLanguageTag("es-PE"));
        cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        cfg.setTemplateUpdateDelayMilliseconds(5000);
        return cfg;
    }
}
