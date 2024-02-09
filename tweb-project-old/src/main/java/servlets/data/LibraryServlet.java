package servlets.data;

import datasource.data.Library;
import datasource.data.Login;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

import java.io.IOException;
import java.util.List;

import static servlets.BasicServlet.LIBRARY_PATH;

@WebServlet(name = "books", value = LIBRARY_PATH)
public class LibraryServlet extends BasicServlet<List<Library>, Library, Library> {

    @Override public List<Library> doGet(HttpServletRequest req){
        String username = req.getParameter("username");
        if(username == null){
            username = Login.getCurrentLogin(req.getSession());
            String inverse = req.getParameter("inverse");
            if("yes".equals(inverse))
                return Library.getPossibleNewBooksOf(username);
        }

        return Library.getBooksOf(username);
    }

    @Override public Library doPost(HttpServletRequest req) throws IOException {
        Library library = gson.fromJson(req.getReader(), Library.class);

        if(!library.isValid())
            throw new LoggableError("Cannot add book with null user or book");

        if(!library.addBook())
            throw new LoggableError("Coudn't add book (maybe user doesn't exist or book already exist)");
        return library;
    }

    @Override public Library doDelete(HttpServletRequest req) throws IOException{
        Library library = gson.fromJson(req.getReader(), Library.class);

        if(!library.removeBook())
            throw new LoggableError("Coudn't remove book (relation between book and user doesn't exist)");
        return library;
    }
}
