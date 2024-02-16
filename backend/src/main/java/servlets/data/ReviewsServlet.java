package servlets.data;

import datasource.data.Review;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

import java.io.IOException;
import java.util.List;

import static servlets.BasicServlet.REVIEWS_PATH;

@WebServlet(name = "reviews", value = REVIEWS_PATH)
public class ReviewsServlet extends BasicServlet<List<Review>, Review, Review> {

    @Override public List<Review> doGet(HttpServletRequest req) {
        String book = req.getParameter("book");
        if(book == null)
            throw new LoggableError("Missing params 'book'");
        return Review.getReviewsOf(book);
    }

    @Override public Review doPost(HttpServletRequest req) throws IOException {
        Review review = gson.fromJson(req.getReader(), Review.class);

        if(!review.isValid())
            throw new LoggableError("Cannot make reviews with null fields");

        if(!review.addReview())
            throw new LoggableError("Coudn't add review");
        return review;
    }

    @Override public Review doDelete(HttpServletRequest req) throws IOException{
        Review review = gson.fromJson(req.getReader(), Review.class);

        if(!review.removeReview())
            throw new LoggableError("Coudn't remove review (review doesn't exist)");
        return review;
    }
}
