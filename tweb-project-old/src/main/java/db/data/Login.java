package db.data;

import db.ManagerDB;
import jakarta.servlet.http.HttpSession;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import static servlets.BasicServlet.LOGIN_PATH;
import static servlets.BasicServlet.LOGOUT_PATH;

public class Login extends ManagerDB {
    public final static String SESSION_USER_KEY = "user";

    //TODO MOVE OUT
    public static boolean isAuthorized(String path, HttpSession session){
        return LOGIN_PATH.equals(path) || LOGOUT_PATH.equals(path)
                || getCurrentLogin(session) != null;
    }

    public static String getCurrentLogin(HttpSession session) {
        return (String) session.getAttribute(SESSION_USER_KEY);
    }

    public static boolean doLogIn(HttpSession session, String username) {
        String logged = getCurrentLogin(session);
        if (logged != null)
            return logged.equals(username);

        session.setAttribute(SESSION_USER_KEY, username);
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

    public static boolean validateCredentials(String username, String password) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "select username from users where username = ? and password = ?");
            ps.setString(1, username);
            ps.setString(2, password);
            return ps.executeQuery().next();
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
}
