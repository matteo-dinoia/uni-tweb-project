package login.service;

import jakarta.servlet.http.HttpSession;

public class LoginService {
    private final static String SESSION_USER_KEY = "user";
    public final static String LOGIN_PATH = "/login";
    public final static String LOGOUT_PATH = "/logout";
    public final static String SIGNIN_PATH = "/signin";

    public static boolean isAuthorized(String path, HttpSession session){
        return LOGIN_PATH.equals(path) || LOGOUT_PATH.equals(path) ||
                SIGNIN_PATH.equals(path) || getCurrentLogin(session) != null;
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

    public static boolean doLogOut(HttpSession session, String username) {
        String logged = getCurrentLogin(session);
        if (logged == null){
            return true;
        }else if (logged.equals(username)) {
            session.invalidate();
            return true;
        }
        return false;
    }

    public static boolean areCredential(String username, String password) {
        return username != null && password != null
                    && username.length() > 4 && username.length() < 32
                    && password.length() > 8 && password.length() < 64;
    }
}
