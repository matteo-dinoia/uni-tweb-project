package login;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import login.service.LoginService;

import java.io.IOException;

@WebFilter(urlPatterns = "*")
public class AuthFilter extends HttpFilter {
    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        if (LoginService.isAuthorized(req.getServletPath(), req.getSession()))
            chain.doFilter(req, res);
        else res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
