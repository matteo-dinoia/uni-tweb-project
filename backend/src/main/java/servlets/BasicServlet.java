package servlets;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import json.JsonResponse;
import json.errors.FatalError;
import json.errors.LoggableError;
import java.io.IOException;
import java.io.PrintWriter;
import static jakarta.servlet.http.HttpServletResponse.SC_BAD_REQUEST;

public abstract class BasicServlet<T, V, W> extends HttpServlet {
    protected final Gson gson = new Gson();
    public final static String  LOGIN_PATH = "/login",
            LOGOUT_PATH = "/logout",
            FRIENDS_PATH = "/friends",
            LIBRARY_PATH = "/books",
            SIMILARS_PATH = "/similars",
            REVIEWS_PATH = "/reviews",
            ADMIN_PATH = "/admin",
            BOOKS_PATH = "/series";

    interface IMethodsHandler<Z>{
        Z handle(HttpServletRequest req) throws IOException;
    }

    private <Z> void doGeneric(HttpServletRequest request, HttpServletResponse response, IMethodsHandler<Z> method) throws IOException {
        JsonResponse<Z> jsonResponse;
        try{
            jsonResponse = new JsonResponse<>(method.handle(request));
        }catch(LoggableError loggable){
            jsonResponse = JsonResponse.getErrorResponse(loggable.getMessage());
        }catch(FatalError fatal){
            response.sendError(fatal.getErrorCode(), fatal.getMessage());
            if(fatal.getDebugErrorMsg() != null)
                System.err.println(fatal.getDebugErrorMsg());
            return;
        }

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println(gson.toJson(jsonResponse));
    }

    // Override old methods
    @Override public final void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException{
        doGeneric(req, resp, this::doGet);
    }
    @Override public final void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException{
        doGeneric(req, resp, this::doPost);
    }
    @Override public final void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException{
        doGeneric(req, resp, this::doDelete);
    }


    // New methods to override
    public final static FatalError notImplemented = new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    public abstract T doGet(HttpServletRequest req) throws IOException;
    public abstract V doPost(HttpServletRequest req) throws IOException;
    public abstract W doDelete(HttpServletRequest req) throws IOException;

    // Login manage
    public final static String SESSION_USER_KEY = "user",
            SESSION_SUPERUSER_KEY = "superuser";

    public static String getLogged(HttpSession session) {
        return (String) session.getAttribute(SESSION_USER_KEY);
    }

    public static boolean isSuperuserLogged(HttpSession session) {
        return "true".equals(session.getAttribute(SESSION_SUPERUSER_KEY));
    }

    public boolean doLogIn(HttpSession session, String username, boolean isSuperuser) {
        String logged = getLogged(session);
        if (logged != null)
            return logged.equals(username);

        session.setAttribute(SESSION_USER_KEY, username);
        session.setAttribute(SESSION_SUPERUSER_KEY, isSuperuser ? "true" : "false");
        session.setMaxInactiveInterval(10 * 60); // 10 minuti
        return true;
    }

    public boolean doLogOut(HttpSession session) {
        String logged = getLogged(session);
        if (logged == null)
            return false;

        session.invalidate();
        return true;
    }
}
