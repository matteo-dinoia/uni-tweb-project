package servlets.filters;

import datasource.data.Login;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import servlets.BasicServlet;

import java.io.IOException;

import static servlets.BasicServlet.*;

@WebFilter(urlPatterns = {FRIENDS_PATH, LIBRARY_PATH, SIMILARS_PATH, ADMIN_PATH, REVIEWS_PATH, BOOKS_PATH})
public class AuthFilter extends HttpFilter {

    @Override protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        // Skip CORS handshake
        if(req.getMethod().equalsIgnoreCase("OPTIONS"))
            chain.doFilter(req, res);

        // Actual authentification
        boolean isAuthorized = BasicServlet.getLogged(req.getSession()) != null;
        if (!isAuthorized)
            res.sendError(HttpServletResponse.SC_UNAUTHORIZED);


        chain.doFilter(req, res);
    }
}
