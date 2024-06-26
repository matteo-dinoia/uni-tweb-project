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
        String username = getLogged(request.getSession());
        if(username == null)
            throw new LoggableError("No logged user");
        return new Login(username, isSuperuserLogged(request.getSession()));
    }

    @Override public Login doPost(HttpServletRequest request) throws IOException{
        BufferedReader in = request.getReader();
        Login loginAttempt;

        try{
            loginAttempt = gson.fromJson(in, Login.class);
        }catch(JsonSyntaxException | JsonIOException exc){
            throw new LoggableError("Wrong format of messages");
        }

        Login loginRes = getLoginResult(request, loginAttempt);
        if(!doLogIn(request.getSession(), loginRes.getUsername(), loginRes.isSuperuser()))
            throw new LoggableError("Already log in with other account");
        return loginRes;
    }

    @Override public Void doDelete(HttpServletRequest req) {
        throw notImplemented;
    }

    private Login getLoginResult(HttpServletRequest request, Login loginAttempt) {
        String previous = getLogged(request.getSession());
        if (previous != null)
            throw new LoggableError("Already logged in as a different user.");

        boolean signup = "true".equals(request.getParameter("signup"));
        if(signup)
            loginAttempt.createLogin();

        return loginAttempt.accessLogin();
    }
}