package servlets.login;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import db.data.Login;
import java.io.IOException;
import static servlets.BasicServlet.*;

@WebFilter(urlPatterns = {FRIENDS_PATH, BOOKS_PATH, SIMILARS_PATH})
public class AuthFilter extends HttpFilter {

    @Override protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        if (isAuthorized(req))
            chain.doFilter(req, res);
        else res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    public static boolean isAuthorized(HttpServletRequest req){
        return Login.getCurrentLogin(req.getSession()) != null;
    }
}
