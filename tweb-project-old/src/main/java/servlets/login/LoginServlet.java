package servlets.login;

import com.google.gson.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.LoginRequest;
import servlets.BasicServlet;
import db.data.Login;
import json.errors.LoggableError;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet(name = "login", value = BasicServlet.LOGIN_PATH)
public class LoginServlet extends BasicServlet<String, String, Void, Void> {

    @Override public String doGet(HttpServletRequest request) {
        String username = Login.getCurrentLogin(request.getSession());
        if(username == null)
            throw new LoggableError("No logged user");
        return username;
    }

    @Override public String doPost(HttpServletRequest request) throws IOException{
        BufferedReader in = request.getReader();
        Gson gson = new Gson();
        LoginRequest op;

        try{
            op = gson.fromJson(in, LoginRequest.class);
        }catch(JsonSyntaxException | JsonIOException exc){
            throw new LoggableError("Wrong format of messages");
        }

        return getLoginResult(request, op);
    }

    private String getLoginResult(HttpServletRequest request, LoginRequest op) {
        String previous = Login.getCurrentLogin(request.getSession());
        String username = op.username();

        if (previous != null && !previous.equals(username))
            throw new LoggableError("Already logged in as a different user.");

        if(op.isSignup()) {
            if (Login.areCredential(username, op.password()) && Login.createUser(username, op.password()))
                return username;
            else
                throw new LoggableError("Coudn't create user (maybe it already exist)");
        }

        if(Login.validateCredentials(username, op.password()) && Login.doLogIn(request.getSession(), username))
            return username;
        else
            throw new LoggableError("Wrong login credential");
    }
}