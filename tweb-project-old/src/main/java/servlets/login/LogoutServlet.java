package servlets.login;

import datasource.data.Login;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

@WebServlet(name = "logout", value = BasicServlet.LOGOUT_PATH)
public class LogoutServlet extends BasicServlet<String, Void, Void> {

    @Override public String doGet(HttpServletRequest request) {
        String username = Login.getCurrentLogin(request.getSession());
        if(!Login.doLogOut(request.getSession()))
            throw new LoggableError("Cannot logout (no logged user)");

        return username;
    }

}