package world.inclub.appnotification.domain.config;

import freemarker.cache.URLTemplateLoader;

import java.net.MalformedURLException;
import java.net.URL;

public class LoaderTemplate extends URLTemplateLoader{
	
	private URL root;
	
    public LoaderTemplate(URL root) {
        super();
        this.root = root;
    }

	@Override
	protected URL getURL(String name) {
		  try {
              return new URL(root, "./"+name);
          } catch (MalformedURLException e) {
              return null;
          }
	}
}
