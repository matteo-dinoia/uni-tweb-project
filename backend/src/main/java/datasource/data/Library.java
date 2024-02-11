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

    public static List<Library> getBooksOf(String username) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select title from libraries where username = ?");
            ps.setString(1, username);

            ResultSet resultSet = ps.executeQuery();
            List<Library> result = new ArrayList<>();
            while(resultSet.next()){
                Library tmp = new Library(username, resultSet.getString(1));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static List<Library> getPossibleNewBooksOf(String username) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select se.title from series se " +
                    "left join libraries li on se.title = li.title and li.username = ? " +
                    "where li.username is null");
            ps.setString(1, username);

            ResultSet resultSet = ps.executeQuery();
            List<Library> result = new ArrayList<>();
            while(resultSet.next()){
                Library tmp = new Library(username, resultSet.getString(1));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean isValid() {
        return username != null && title != null;
    }

    public boolean addBook() {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO libraries(username, title) VALUES (?, ?)");
            ps.setString(1, username);
            ps.setString(2, title);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean removeBook() {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM libraries where (username = ? and title = ?)");
            ps.setString(1, username);
            ps.setString(2, title);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }
}
