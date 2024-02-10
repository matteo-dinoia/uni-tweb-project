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
    public final static String SESSION_USER_KEY = "user",
                                SESSION_SUPERUSER_KEY = "superuser";
    private final String username;
    private final String password;
    private final boolean isSuperuser;


    public Login(String username, boolean isSuperuser) {
        this.username = username;
        this.password = null;
        this.isSuperuser = isSuperuser;
    }

    public static String getCurrentLogin(HttpSession session) {
        return (String) session.getAttribute(SESSION_USER_KEY);
    }

    public static boolean getCurrentSuperuserStatus(HttpSession session) {
        return "true".equals(session.getAttribute(SESSION_SUPERUSER_KEY));
    }

    public static boolean doLogIn(HttpSession session, String username, boolean superuser) {
        String logged = getCurrentLogin(session);
        if (logged != null)
            return logged.equals(username);

        session.setAttribute(SESSION_USER_KEY, username);
        session.setAttribute(SESSION_SUPERUSER_KEY, superuser ? "true" : "false");
        session.setMaxInactiveInterval(10 * 60); // 10 minuti
        return true;
    }

    public static boolean doLogOut(HttpSession session) {
        String logged = getCurrentLogin(session);
        if (logged == null)
            return false;

        session.invalidate();
        return true;
    }

    public static boolean areCredential(String username, String password) {
        return username != null && password != null
                    && username.length() >= 4 && username.length() <= 32
                    && password.length() >= 8 && password.length() <= 64;
    }

    public static Login validateCredentials(String username, String password) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "select issuperuser from users where username = ? and password = ?");
            ps.setString(1, username);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();
            if(!rs.next())
                return null;
            return new Login(username, rs.getBoolean(1));
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static boolean createUser(String username, String password) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "insert into users (username, password, issuperuser) values (?, ?, ?)");
            ps.setString(1, username);
            ps.setString(2, password);
            ps.setBoolean(3, false);

            try{
                return ps.executeUpdate() > 0;
            }catch (SQLException ignored){
                return false;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static List<Login> getAllUsers(String username) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "select username, issuperuser from users where username <> ?");
            ps.setString(1, username);

            ResultSet resultSet = ps.executeQuery();
            List<Login> result = new ArrayList<>();
            while(resultSet.next()){
                Login tmp = new Login(resultSet.getString(1), resultSet.getBoolean(2));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static boolean deleteUser(String user) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "delete from users where username=?");
            ps.setString(1, user);

            try{
                return ps.executeUpdate() == 1;
            }catch (SQLException ignored){
                System.out.println(ignored.getMessage());
                return false;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public Login createLogin() {
        if (areCredential(username, password) && createUser(username, password))
            return new Login(username, false);
        else
            throw new LoggableError("Coudn't create user (maybe it already exist)");
    }

    public Login accessLogin(HttpSession session) {
        Login login = Login.validateCredentials(username, password);
        if(login != null && Login.doLogIn(session, username, "admin".equals(username)))
            return login;
        else
            throw new LoggableError("Wrong login credential");
    }
}
