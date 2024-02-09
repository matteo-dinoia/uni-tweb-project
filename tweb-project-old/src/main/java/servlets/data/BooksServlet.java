package servlets.data;

import datasource.data.Book;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;
import java.io.IOException;
import static servlets.BasicServlet.BOOKS_PATH;

@WebServlet(name = "series", value = BOOKS_PATH)
public class BooksServlet extends BasicServlet<Book, Void, Void> {

    @Override public Book doGet(HttpServletRequest req) throws IOException {
        String title = req.getParameter("title");
        if(title == null)
            throw new LoggableError("Missing parameter for request (title)");
        return Book.getBookInfo(title);
    }

    @Override public Void doPost(HttpServletRequest req) throws IOException {
        throw notImplemented;
    }

    @Override public Void doDelete(HttpServletRequest req) throws IOException {
        throw notImplemented;
    }
}
