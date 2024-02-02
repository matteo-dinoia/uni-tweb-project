package servlets.data;

import db.data.Login;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import db.data.Library;
import servlets.BasicServlet;
import static servlets.BasicServlet.BOOKS_PATH;

@WebServlet(name = "books", value = BOOKS_PATH)
public class BooksServlet extends BasicServlet<List<Library>, Library, Library, Library> {

    @Override public List<Library> doGet(HttpServletRequest request){
        String username = request.getParameter("username");
        if(username == null)
            username = Login.getCurrentLogin(request.getSession());
        return Library.getBooksOf(username);
    }
}
