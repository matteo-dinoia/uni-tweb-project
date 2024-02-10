package servlets.login;

import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import datasource.data.Login;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

import java.io.BufferedReader;
import java.io.IOException;

import static servlets.BasicServlet.LOGIN_PATH;

@WebServlet(name = "login", value = LOGIN_PATH)
public class LoginServlet extends BasicServlet<Login, Login, Void> {

    @Override public Login doGet(HttpServletRequest request) {
        String username = Login.getCurrentLogin(request.getSession());
        if(username == null)
            throw new LoggableError("No logged user");
        return new Login(username, Login.getCurrentSuperuserStatus(request.getSession()));
    }

    @Override public Login doPost(HttpServletRequest request) throws IOException{
        BufferedReader in = request.getReader();
        Login loginAttempt;

        try{
            loginAttempt = gson.fromJson(in, Login.class);
        }catch(JsonSyntaxException | JsonIOException exc){
            throw new LoggableError("Wrong format of messages");
        }

        return getLoginResult(request, loginAttempt);
    }

    @Override public Void doDelete(HttpServletRequest req) throws IOException {
        throw notImplemented;
    }

    private Login getLoginResult(HttpServletRequest request, Login loginAttempt) {
        String previous = Login.getCurrentLogin(request.getSession());
        if (previous != null)
            throw new LoggableError("Already logged in as a different user.");

        boolean signup = "true".equals(request.getParameter("signup"));
        if(signup)
            loginAttempt.createLogin();

        return loginAttempt.accessLogin(request.getSession());

    }
}