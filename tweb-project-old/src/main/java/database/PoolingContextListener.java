package database;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class PoolingContextListener implements ServletContextListener {
    public void contextInitialized(ServletContextEvent sce) {
        PoolingPersistenceManager.get();
    }

    public void contextDestroyed(ServletContextEvent sce) {
        PoolingPersistenceManager.get().terminateDataSource();
    }
}
