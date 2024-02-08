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

    public boolean addReview(){
        //TODO add replace ?
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO reviews(username, book, commenttitle, commenttext) " +
                            "VALUES (?, ?, ?, ?)");
            ps.setString(1, username);
            ps.setString(2, book);
            ps.setString(3, commenttitle);
            ps.setString(4, commenttext);

            try{
                return ps.executeUpdate() == 1;
            }catch (SQLException sqlException){
                System.out.println(sqlException.getMessage().toLowerCase());
                if(sqlException.getMessage().toLowerCase().contains("already exists"))
                    return editReview();
                else throw sqlException;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean removeReview(){
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM reviews where (username = ? and book = ? " +
                            "and commenttitle = ? and commenttext = ?)");
            ps.setString(1, username);
            ps.setString(2, book);
            ps.setString(3, commenttitle);
            ps.setString(4, commenttext);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean editReview(){
        //TODO keep it?
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "UPDATE reviews " +
                        "SET commenttitle = ?, commenttext = ? " +
                        "WHERE username = ? and book = ?");
            ps.setString(1, commenttitle);
            ps.setString(2, commenttext);
            ps.setString(3, username);
            ps.setString(4, book);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean isValid() {
        return username != null && book != null
                && commenttitle != null && commenttext != null;
    }
}
