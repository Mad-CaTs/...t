package com.ejemplo.casoT2;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.xml.ws.Endpoint;

@WebListener
public class Soap implements ServletContextListener {

    public void contextInitialized(ServletContextEvent sce) {
        String url = "http://localhost:8080/casoT2/ws/catalogo";
        Endpoint.publish(url, new CatalogoService());
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) { }
}