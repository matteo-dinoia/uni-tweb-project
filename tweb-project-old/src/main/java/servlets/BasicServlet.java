package servlets;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
            BOOKS_PATH = "/books",
            SIMILARS_PATH = "/similars",
            REVIEWS_PATH = "/reviews",
            ADMIN_PATH = "/admin";

    private Object runCorrectMethod(HttpServletRequest req) throws IOException {
        return switch (req.getMethod().toLowerCase()){
            case "get" -> doGet(req);
            case "post" -> doPost(req);
            case "delete" -> doDelete(req);
            default -> throw new FatalError(404, "Method not supported by this servlet");
        };
    }

    @Override protected final void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonResponse<?> jsonResponse;
        try{
            jsonResponse = new JsonResponse<>(runCorrectMethod(req));
        }catch(LoggableError loggable){
            jsonResponse = JsonResponse.getErrorResponse(loggable.getMessage());
        }catch(FatalError fatal){
            resp.sendError(fatal.errorCode, fatal.getMessage());
            if(fatal.debugErrorMsg != null)
                System.err.println(fatal.debugErrorMsg);
            return;
        }

        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        out.println(gson.toJson(jsonResponse));
    }

    // New methods to override
    public T doGet(HttpServletRequest req) throws IOException{
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }
    public V doPost(HttpServletRequest req) throws IOException{
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }
    public W doDelete(HttpServletRequest req) throws IOException{
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }
}
