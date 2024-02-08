package servlets.data;
import db.data.Friend;
import db.data.Review;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

import java.io.IOException;
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

    @Override public Review doPost(HttpServletRequest request) throws IOException {
        Review review = gson.fromJson(request.getReader(), Review.class);

        if(!review.isValid())
            throw new LoggableError("Cannot make reviews with null fields");

        //TODO WRONG ERROR -> fix
        if(!review.addReview())
            throw new LoggableError("Coudn't add review (maybe user or doesn't exist or review already exist)");
        return review;
    }

    @Override public Review doDelete(HttpServletRequest request) throws IOException{
        Review review = gson.fromJson(request.getReader(), Review.class);

        if(!review.removeReview())
            throw new LoggableError("Coudn't remove review (review doesn't exist)");
        return review;
    }
}
