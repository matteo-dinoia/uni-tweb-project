package servlets.data;

import db.ManagerDB;
import db.data.Login;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.List;
import db.data.Book;
import json.errors.LoggableError;
import servlets.BasicServlet;
import static servlets.BasicServlet.ADMIN_PATH;

@WebServlet(name = "admin", urlPatterns = {ADMIN_PATH + "/*"})
public class AdminServlet extends BasicServlet<List<?>, Book, Void, Void> {

    private String accessCheck(HttpServletRequest request){
        if(!Login.getCurrentSuperuserStatus(request.getSession()))
            throw new LoggableError("Not authorized access to admin commands");
        return Login.getCurrentLogin(request.getSession());
    }

    @Override public List<?> doGet(HttpServletRequest request){
        String username = accessCheck(request);

        if("/books".equals(request.getPathInfo()))
            return Book.getAllBooks();
        else if("/users".equals(request.getPathInfo()))
            return Login.getAllUsers(username);
        else
            throw new LoggableError("The sub-method is not implemented");
    }

    @Override public Book doPost(HttpServletRequest request) throws IOException {
        accessCheck(request);

        Book book = gson.fromJson(request.getReader(), Book.class);

        if(!book.isValid())
            throw new LoggableError("Cannot add book with null parameters");

        if(!book.addBook())
            throw new LoggableError("Coudn't add book (maybe user doesn't exist or book already exist)");
        return book;
    }
}