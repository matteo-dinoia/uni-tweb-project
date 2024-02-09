package servlets.data;

import datasource.data.Login;
import datasource.data.Similar;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

import java.io.IOException;
import java.util.List;

import static servlets.BasicServlet.SIMILARS_PATH;

@WebServlet(name = "similars", value = SIMILARS_PATH)
public class SimilarsServlet extends BasicServlet<List<Similar>, Similar, Similar> {
    @Override public List<Similar> doGet(HttpServletRequest req) {
        String book = req.getParameter("book");
        if(book == null)
            throw new LoggableError("Missing params 'book'");

        String inverse = req.getParameter("inverse");
        if("yes".equals(inverse)){
            String username = Login.getCurrentLogin(req.getSession());
            return Similar.getPossibleNewSimilarsOf(username, book);
        }

        return Similar.getSimilarsOf(book);
    }

    @Override public Similar doPost(HttpServletRequest req) throws IOException {
        Similar similar = gson.fromJson(req.getReader(), Similar.class);

        if(!similar.isValid())
            throw new LoggableError("Cannot add similar book with null user or book or similar book");

        if(!similar.addSimilar())
            throw new LoggableError("Coudn't add similar (maybe user doesn't exist or similar already exist)");
        return similar;
    }

    @Override public Similar doDelete(HttpServletRequest req) throws IOException{
        Similar similar = gson.fromJson(req.getReader(), Similar.class);

        if(!similar.removeSimilar())
            throw new LoggableError("Coudn't remove similar book (relation between books doesn't exist)");
        return similar;
    }
}
