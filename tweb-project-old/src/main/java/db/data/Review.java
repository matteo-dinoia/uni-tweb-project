package db.data;

import db.ManagerDB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Review extends ManagerDB {
    private final String username;
    private final String book;
    private final String commenttitle;
    private final String commenttext;

    public Review(String username, String book, String commenttitle, String commenttext) {
        this.username = username;
        this.book = book;
        this.commenttitle = commenttitle;
        this.commenttext = commenttext;
    }

    public static List<Review> getReviewsOf(String book) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select * from reviews where book = ?");
            ps.setString(1, book);

            ResultSet resultSet = ps.executeQuery();
            List<Review> result = new ArrayList<>();
            while(resultSet.next()){
                Review tmp = new Review(resultSet.getString(1), resultSet.getString(2),
                        resultSet.getString(3), resultSet.getString(4));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }
}
