package servlets.data;

import db.data.Similar;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;
import java.util.List;
import static servlets.BasicServlet.SIMILARS_PATH;

@WebServlet(name = "similars", value = SIMILARS_PATH)
public class SimilarsServlet extends BasicServlet<List<Similar>, Similar, Similar, Similar> {
    @Override public List<Similar> doGet(HttpServletRequest request) {
        String book = request.getParameter("book");
        if(book == null)
            throw new LoggableError("Missing params 'book'");
        return Similar.getSimilarsOf(book);
    }
}
