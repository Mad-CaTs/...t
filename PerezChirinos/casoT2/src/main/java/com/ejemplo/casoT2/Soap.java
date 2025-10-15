package com.ejemplo.casoT2;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.xml.ws.Endpoint;

@WebListener
public class Soap implements ServletContextListener {

    public void contextInitialized(ServletContextEvent sce) {
        String url = "http://localhost:8080/casoT2/ws/catalogo";
        Endpoint.publish(url, new CatalogoService());
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) { }
}
