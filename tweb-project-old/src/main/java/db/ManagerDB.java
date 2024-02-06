package db;

import db.util.PoolingPersistenceManager;
import jakarta.persistence.Transient;
import json.errors.FatalError;

import java.io.Serializable;
import java.sql.*;
import static jakarta.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;

public class ManagerDB implements Serializable {
    @Transient
    private static final PoolingPersistenceManager connPooling = PoolingPersistenceManager.get();

    protected static Connection getConn() throws SQLException{
        return connPooling.getConnection();
    }

    protected static FatalError sqlError(String debugMsg){
        return new FatalError(SC_INTERNAL_SERVER_ERROR,
                "Internal Server Error while connecting to database", debugMsg);
    }
}
