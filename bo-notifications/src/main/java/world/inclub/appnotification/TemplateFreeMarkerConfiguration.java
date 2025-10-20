package world.inclub.appnotification;


import freemarker.cache.ClassTemplateLoader;
import freemarker.cache.FileTemplateLoader;
import freemarker.cache.TemplateLoader;
import freemarker.template.TemplateExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import world.inclub.appnotification.domain.config.LoaderTemplate;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Locale;

@Configuration
public class TemplateFreeMarkerConfiguration {
	private final static Logger logger = LoggerFactory.getLogger(TemplateFreeMarkerConfiguration.class);
	
	@Value("${template.url.email}")
	private  String urlTemplateEmail;


	@Bean
	public freemarker.template.Configuration getFreeMarkerConfigurationBean() throws IOException {
		freemarker.template.Configuration configuration = new freemarker.template.Configuration(freemarker.template.Configuration.VERSION_2_3_31);
		configuration.setDefaultEncoding("UTF-8");
		configuration.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
		configuration.setLogTemplateExceptions(false);
		// Define la ubicación de las plantillas en el classpath
		String templatePackagePath = "/templates";

		// Crea el template de manera LOCAL - DESACTIVAR PARA TRABAJAR CON AWS -
		TemplateLoader templateLoader = new ClassTemplateLoader(TemplateFreeMarkerConfiguration.class, templatePackagePath);
		configuration.setTemplateLoader(templateLoader);
		configuration.setLocale(Locale.ROOT);
		configuration.setLocalizedLookup(false);

		/* TRABAJAR CON EL S3 DE AMANAZON
		LoaderTemplate lt = null;sadasdasdadasdasd
		try {
			lt = new LoaderTemplate(new URL(urlTemplateEmail));
		} catch (MalformedURLException e) {
			logger.error("Exception ex TemplateFree", e);
		}
		configuration.setTemplateLoader(lt);
        */
		return configuration;
	}


}
