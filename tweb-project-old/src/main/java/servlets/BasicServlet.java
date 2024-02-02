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

public abstract class BasicServlet<T, V, W, X> extends HttpServlet {
    public final static String  LOGIN_PATH = "/login",
                                LOGOUT_PATH = "/logout",
                                FRIENDS_PATH = "/friends",
                                BOOKS_PATH = "/books",
                                SIMILARS_PATH = "/similars";

    private <Z> void write(HttpServletResponse response, Z objContent) throws IOException {
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
            if(fatal.debugErrorMsg != null)
                System.err.println(fatal.debugErrorMsg);
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
            if(fatal.debugErrorMsg != null)
                System.err.println(fatal.debugErrorMsg);
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
            if(fatal.debugErrorMsg != null)
                System.err.println(fatal.debugErrorMsg);
            return;
        }
        write(response, jsonResponse);
    }
    @Override public final void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException{
        JsonResponse<X> jsonResponse;
        try{
            jsonResponse = new JsonResponse<>(doDelete(request));
        }catch(LoggableError loggable){
            jsonResponse = JsonResponse.getErrorResponse(loggable.getMessage());
        }catch(FatalError fatal){
            response.sendError(fatal.errorCode, fatal.getMessage());
            if(fatal.debugErrorMsg != null)
                System.err.println(fatal.debugErrorMsg);
            return;
        }
        write(response, jsonResponse);
    }

    public T doGet(HttpServletRequest request) {
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }
    public V doPost(HttpServletRequest request) throws IOException{
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }
    public W doPut(HttpServletRequest request) throws IOException{
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }
    public X doDelete(HttpServletRequest request) throws IOException{
        throw new FatalError(SC_BAD_REQUEST, "Methods not defined in servlet");
    }


}
