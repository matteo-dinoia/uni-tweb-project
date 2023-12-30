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

@WebServlet(name = "Signin", value = LoginService.SIGNIN_PATH)
public class SigninServlet extends HttpServlet {

    public void init() {}
    public void destroy() {}

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //TODO COLLAPSE
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

        if (previous != null) {
            out.println(OperationResult.newLoginAttempt(previous, "Can't sign in because logged in."));
        } else if(LoginService.areCredential(username, password)) {
            if(ManagerDB.get().createUser(username, password))
                out.println(OperationResult.newLoginAttempt(username, null));
            else  out.println(OperationResult.newLoginAttempt(username, "Error during save on database."));
        } else {
            out.println(OperationResult.newLoginAttempt(username, "Credentials don't respect limits."));
        }
    }
}