package datasource.data;

import datasource.ManagerDB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Book extends ManagerDB {
    private final String title;
    private final String description;
    private final String imageLink;


    public Book(String title, String description, String image) {
        this.title = title;
        this.description = description;
        this.imageLink = image;
    }


    public static List<Book> getAllBooks() {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select * from series");

            ResultSet rs = ps.executeQuery();
            List<Book> result = new ArrayList<>();
            while(rs.next()){
                Book tmp = new Book(rs.getString(1), rs.getString(2), rs.getString(3));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }


    public boolean addBook() {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO series(title, description) VALUES (?, ?)");
            ps.setString(1, title);
            ps.setString(2, description);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean isValid() {
        return title != null && description != null;
    }

    public static Book getBookInfo(String title){
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select * from series where title = ?");
            ps.setString(1, title);

            ResultSet rs = ps.executeQuery();
            if(!rs.next())
                return null;
            return new Book(rs.getString(1), rs.getString(2), rs.getString(3));
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }
}
