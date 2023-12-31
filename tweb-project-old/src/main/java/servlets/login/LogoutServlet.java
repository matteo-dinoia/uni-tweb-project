package servlets.login;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import servlets.BasicServlet;
import db.data.Login;
import json.errors.LoggableError;

@WebServlet(name = "logout", value = BasicServlet.LOGOUT_PATH)
public class LogoutServlet extends BasicServlet<String, Void, Void> {

    @Override public String doGet(HttpServletRequest request) {
        String username = Login.getCurrentLogin(request.getSession());
        if(Login.doLogOut(request.getSession()))
            throw new LoggableError("No logged user");

        return username;
    }

}