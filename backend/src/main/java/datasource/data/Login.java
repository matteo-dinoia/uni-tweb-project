package datasource.data;

import datasource.ManagerDB;
import jakarta.servlet.http.HttpSession;
import json.errors.LoggableError;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Login extends ManagerDB {
    private final String username;
    private final String password;
    private final boolean isSuperuser;

    public Login(String username, boolean isSuperuser) {
        this.username = username;
        this.password = null;
        this.isSuperuser = isSuperuser;
    }

    public boolean areCredential() {
        return username != null && password != null
                    && username.length() >= 4 && username.length() <= 32
                    && password.length() >= 8 && password.length() <= 64;
    }

    public Login validateCredentials() {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("SELECT issuperuser " +
                    "FROM users WHERE username = ? AND password = ?")){
                ps.setString(1, username);
                ps.setString(2, password);

                try(ResultSet rs = ps.executeQuery()){
                    if(!rs.next())
                        return null;
                    return new Login(username, rs.getBoolean(1));
                }
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean createUser() {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("INSERT " +
                    "INTO users (username, password, issuperuser) VALUES (?, ?, ?)")){
                ps.setString(1, username);
                ps.setString(2, password);
                ps.setBoolean(3, false);

                return excecuteUpdateCatchingError(ps) == 1;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static List<Login> getAllUsers(String username) {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("SELECT username, issuperuser " +
                    "FROM users WHERE username <> ?")){
                ps.setString(1, username);

                ResultSet resultSet = ps.executeQuery();
                List<Login> result = new ArrayList<>();
                while(resultSet.next())
                    result.add(new Login(resultSet.getString(1), resultSet.getBoolean(2)));

                return result;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static boolean deleteUser(String user) {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("delete from users where username=?")){
                ps.setString(1, user);

                return excecuteUpdateCatchingError(ps) == 1;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public void createLogin() {
        if(!areCredential())
            throw new LoggableError("Coudn't create user (username must be 4..32 characters and password 8..64))");
        if(!createUser())
            throw new LoggableError("Coudn't create user (maybe it already exist)");
    }

    public Login accessLogin() {
        Login login = validateCredentials();
        if(login == null)
            throw new LoggableError("Wrong login credential");

        return login;
    }

    public String getUsername(){ return this.username; }
    public boolean isSuperuser(){ return this.isSuperuser; }
}
