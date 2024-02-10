package datasource.data;

import datasource.ManagerDB;

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
    private final int valutation;

    public Review(String username, String book, String commenttitle, String commenttext, int valutation) {
        this.username = username;
        this.book = book;
        this.commenttitle = commenttitle;
        this.commenttext = commenttext;
        this.valutation = valutation;
    }

    public static List<Review> getReviewsOf(String book) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select * from reviews where book = ?");
            ps.setString(1, book);

            ResultSet rs = ps.executeQuery();
            List<Review> result = new ArrayList<>();
            while(rs.next()){
                Review tmp = new Review(rs.getString(1), rs.getString(2),
                        rs.getString(3), rs.getString(4), rs.getInt(5));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean addReview(){
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO reviews(username, book, commenttitle, commenttext, valutation) " +
                            "VALUES (?, ?, ?, ?, ?)");
            ps.setString(1, username);
            ps.setString(2, book);
            ps.setString(3, commenttitle);
            ps.setString(4, commenttext);
            ps.setInt(5, valutation);

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

    // TODO remove useless parameters ?
    public boolean removeReview(){
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM reviews where (username = ? and book = ? " +
                            "and commenttitle = ? and commenttext = ? and valutation = ?)");
            ps.setString(1, username);
            ps.setString(2, book);
            ps.setString(3, commenttitle);
            ps.setString(4, commenttext);
            ps.setInt(5, valutation);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean editReview(){
        //TODO keep it?
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "UPDATE reviews " +
                        "SET commenttitle = ?, commenttext = ?, valutation = ? " +
                        "WHERE username = ? and book = ?");
            ps.setString(1, commenttitle);
            ps.setString(2, commenttext);
            ps.setInt(3, valutation);
            ps.setString(4, username);
            ps.setString(5, book);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean isValid() {
        return username != null && book != null
                && commenttitle != null && commenttext != null;
        // TODO add valutation
    }
}
