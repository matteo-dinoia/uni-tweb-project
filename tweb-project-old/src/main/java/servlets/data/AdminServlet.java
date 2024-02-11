package servlets.data;

import datasource.data.Book;
import datasource.data.Login;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;
import java.io.IOException;
import java.util.List;

import static servlets.BasicServlet.ADMIN_PATH;

@WebServlet(name = "admin", urlPatterns = {ADMIN_PATH + "/*"})
public class AdminServlet extends BasicServlet<List<?>, Book, Boolean> {

    private String accessCheck(HttpServletRequest req){
        if(!Login.getCurrentSuperuserStatus(req.getSession()))
            throw new LoggableError("Not authorized access to admin commands");
        return Login.getCurrentLogin(req.getSession());
    }

    @Override public List<?> doGet(HttpServletRequest req){
        String username = accessCheck(req);

        if("/books".equals(req.getPathInfo()))
            return Book.getAllBooks();
        else if("/users".equals(req.getPathInfo()))
            return Login.getAllUsers(username);
        else
            throw new LoggableError("The sub-method is not implemented");
    }

    @Override public Book doPost(HttpServletRequest req) throws IOException {
        accessCheck(req);

        Book book = gson.fromJson(req.getReader(), Book.class);

        if(!book.isValid())
            throw new LoggableError("Cannot add book with null parameters");

        if(!book.addBook())
            throw new LoggableError("Coudn't add book (maybe user doesn't exist or book already exist)");
        return book;
    }

    @Override public Boolean doDelete(HttpServletRequest req) {
        accessCheck(req);

        String user = req.getParameter("user");
        if(user != null){
            return Login.deleteUser(user);
        }

        String book = req.getParameter("book");
        if(book != null){
            return Book.deleteBook(book);
        }

        throw new LoggableError("The sub-method is not implemented");
    }
}