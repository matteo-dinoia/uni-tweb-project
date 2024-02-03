package servlets.data;
import db.data.Review;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

import java.util.List;

import static servlets.BasicServlet.REVIEWS_PATH;

@WebServlet(name = "reviews", value = REVIEWS_PATH)
public class ReviewsServlet extends BasicServlet<List<Review>, Review, Review, Review> {

    @Override public List<Review> doGet(HttpServletRequest request) {
        String book = request.getParameter("book");
        if(book == null)
            throw new LoggableError("Missing params 'book'");
        return Review.getReviewsOf(book);
    }

}
