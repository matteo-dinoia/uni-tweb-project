package datasource.data;

import datasource.ManagerDB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Library extends ManagerDB {
    private final String username;
    private final String title;

    public Library(String username, String title){
        this.username = username;
        this.title = title;
    }

    public boolean isValid() {
        return username != null && title != null;
    }

    public static List<Library> getBooksOf(String username) {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("SELECT title FROM libraries WHERE username = ?")){
                ps.setString(1, username);

                try(ResultSet resultSet = ps.executeQuery()){
                    List<Library> result = new ArrayList<>();
                    while(resultSet.next())
                        result.add(new Library(username, resultSet.getString(1)));

                    return result;
                }
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static List<Library> getPossibleNewBooksOf(String username) {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("SELECT se.title FROM series se " +
                    "LEFT JOIN libraries li ON se.title = li.title AND li.username = ? " +
                    "WHERE li.username IS NULL")){
                ps.setString(1, username);

                try(ResultSet resultSet = ps.executeQuery()){
                    List<Library> result = new ArrayList<>();
                    while(resultSet.next())
                        result.add(new Library(username, resultSet.getString(1)));

                    return result;
                }
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean addBook() {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO libraries(username, title) VALUES (?, ?)")){
                ps.setString(1, username);
                ps.setString(2, title);

                return ps.executeUpdate() == 1;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean removeBook() {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM libraries WHERE (username = ? AND title = ?)")){
                ps.setString(1, username);
                ps.setString(2, title);

                return ps.executeUpdate() == 1;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }
}
