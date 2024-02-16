package servlets.login;

import datasource.data.Login;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

import java.io.IOException;

@WebServlet(name = "logout", value = BasicServlet.LOGOUT_PATH)
public class LogoutServlet extends BasicServlet<String, Void, Void> {

    @Override public String doGet(HttpServletRequest request) {
        String username = BasicServlet.getLogged(request.getSession());
        if(!doLogOut(request.getSession()))
            throw new LoggableError("Cannot logout (no logged user)");

        return username;
    }

    @Override public Void doPost(HttpServletRequest req) {
        throw notImplemented;
    }

    @Override public Void doDelete(HttpServletRequest req) {
        throw notImplemented;
    }

}