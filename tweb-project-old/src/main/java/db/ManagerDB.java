package db;

import db.util.PoolingPersistenceManager;
import java.sql.*;

public class ManagerDB {
    private static final PoolingPersistenceManager connPooling = PoolingPersistenceManager.get();

    private static ManagerDB singleton = null;
    public static ManagerDB get(){
        if(singleton == null)
            singleton = new ManagerDB();
        return singleton;
    }

    public static Connection getConn() throws SQLException{
        return connPooling.getConnection();
    }

    public boolean validateCredentials(String username, String password){
        try(Connection conn = ManagerDB.getConn()){
            PreparedStatement ps = conn.prepareStatement("select username from "user" where username = ? and password = ?");
            ps.setString(1, username);
            ps.setString(2, password);
            return ps.executeQuery().next();
        }catch(SQLException ex){
            System.err.println("ERROR in validateCredentials");
        }
        return false;
    }

    public boolean createUser(String username, String password) {
        try(Connection conn = ManagerDB.getConn()){
            PreparedStatement ps = conn.prepareStatement("insert into "user" (username, password) values (?, ?)");
            ps.setString(1, username);
            ps.setString(2, password);

            return ps.executeUpdate() > 0;
        }catch(SQLException ex){
            System.err.println("ERROR in createUser");
        }
        return false;
    }
}
