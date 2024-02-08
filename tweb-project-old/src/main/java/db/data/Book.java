package db.data;

import db.ManagerDB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Book extends ManagerDB {
    private final String title;
    private final String description;


    public Book(String title, String description) {
        this.title = title;
        this.description = description;
    }


    public static List<Book> getAllBooks() {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select * from series");

            ResultSet resultSet = ps.executeQuery();
            List<Book> result = new ArrayList<>();
            while(resultSet.next()){
                Book tmp = new Book(resultSet.getString(1), resultSet.getString(2));
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
}
