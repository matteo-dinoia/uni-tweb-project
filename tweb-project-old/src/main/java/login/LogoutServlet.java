package login;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import login.service.LoginService;
import login.service.OperationResult;

import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "Logout", value = LoginService.LOGOUT_PATH)
public class LogoutServlet extends HttpServlet {

    public void init() {}
    public void destroy() {}

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String username = LoginService.getCurrentLogin(request.getSession());
        if (username == null) {
            out.println(OperationResult.newLogoutAttempt("No logged user"));
            return;
        }

        LoginService.doLogOut(request.getSession(), username);
        out.println(OperationResult.newLogoutAttempt(null));
    }

}