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
import java.sql.SQLException;

import static jakarta.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static jakarta.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;

public abstract class BasicServlet<T, V, W> extends HttpServlet {
    public final static String  LOGIN_PATH = "/login",
                                LOGOUT_PATH = "/logout",
                                FRIENDS_PATH = "/friends";

    void write(HttpServletResponse response, Object objContent) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        out.println(new Gson().toJson(objContent));
    }

    @Override public void init() {}
    @Override public void destroy() {}

    @Override public final void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException{
        JsonResponse<T> jsonResponse;
        try{
            jsonResponse = new JsonResponse<>(doGet(request));
        }catch(LoggableError loggable){
            jsonResponse = JsonResponse.getErrorResponse(loggable.getMessage());
        }catch(FatalError fatal){
            response.sendError(fatal.errorCode, fatal.getMessage());
            return;
        }
        write(response, jsonResponse);
    }
    @Override public final void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException{
        JsonResponse<V> jsonResponse;
        try{
            jsonResponse = new JsonResponse<>(doPost(request));
        }catch(LoggableError loggable){
            jsonResponse = JsonResponse.getErrorResponse(loggable.getMessage());
        }catch(FatalError fatal){
            response.sendError(fatal.errorCode, fatal.getMessage());
            return;
        }
        write(response, jsonResponse);
    }
    @Override public final void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException{
        JsonResponse<W> jsonResponse;
        try{
            jsonResponse = new JsonResponse<>(doPut(request));
        }catch(LoggableError loggable){
            jsonResponse = JsonResponse.getErrorResponse(loggable.getMessage());
        }catch(FatalError fatal){
            response.sendError(fatal.errorCode, fatal.getMessage());
            return;
        }
        write(response, jsonResponse);
    }

    public T doGet(HttpServletRequest request) throws IOException {
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }
    public V doPost(HttpServletRequest request) throws IOException{
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }
    public W doPut(HttpServletRequest request) throws IOException{
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }


}
