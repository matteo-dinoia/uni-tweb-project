package login;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import db.ManagerDB;
import login.service.LoginService;
import login.service.OperationResult;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "Login", value = LoginService.LOGIN_PATH)
public class LoginServlet extends HttpServlet {

    public void init() {}
    public void destroy() {}

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String username = LoginService.getCurrentLogin(request.getSession());
        out.println(OperationResult.newStatus(username));
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        BufferedReader in = request.getReader();
        PrintWriter out = response.getWriter();


        JsonElement el = JsonParser.parseReader(in);
        if(!el.isJsonObject()){
            out.println(OperationResult.newLoginAttempt("", "Wrong format of request body"));
            return;
        }
        JsonObject loginObject = el.getAsJsonObject();

        String previous = LoginService.getCurrentLogin(request.getSession());
        String username = loginObject.get("username").getAsString();
        String password = loginObject.get("password").getAsString();

        if (previous != null && !previous.equals(username)) {
            out.println(OperationResult.newLoginAttempt(previous, "Already logged in as a different user."));
        } else if(ManagerDB.get().validateCredentials(username, password)) {
            LoginService.doLogIn(request.getSession(), username);
            out.println(OperationResult.newLoginAttempt(username, null));
        } else {
            out.println(OperationResult.newLoginAttempt(previous, "Invalid credentials"));
        }
    }
}