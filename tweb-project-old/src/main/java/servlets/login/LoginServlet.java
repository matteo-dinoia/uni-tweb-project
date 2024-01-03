package servlets.login;

import com.google.gson.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.JsonResponse;
import json.LoginRequest;
import servlets.BasicServlet;
import db.data.Login;
import json.errors.LoggableError;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet(name = "login", value = BasicServlet.LOGIN_PATH)
public class LoginServlet extends BasicServlet<String, String, Void, Void> {

    @Override public String doGet(HttpServletRequest request) {
        return Login.getCurrentLogin(request.getSession());
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

        if(op.isSignup() && Login.areCredential(username, op.password())) {
            if (Login.createUser(username, op.password()))
                return username;
        } else if(!op.isSignup() && Login.validateCredentials(username, op.password())) {
            if (Login.doLogIn(request.getSession(), username))
                return username;
        } else{
            throw new LoggableError("Already logged in as a different user.");
        }

        throw new LoggableError("Internal server error");
    }
}