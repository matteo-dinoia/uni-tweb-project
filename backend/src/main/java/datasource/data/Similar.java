package datasource.data;

import datasource.ManagerDB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Similar extends ManagerDB {
    private final String username;
    private final String book;
    private final String similar;

    public Similar(String username, String book, String similar){
        this.username = username;
        this.book = book;
        this.similar = similar;
    }

    public boolean isValid() {
        return username != null && book != null && similar != null;
    }

    public static List<Similar> getSimilarsOf(String book) {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("SELECT * FROM similars WHERE book = ?")){
                ps.setString(1, book);

                try(ResultSet resultSet = ps.executeQuery()){
                    List<Similar> result = new ArrayList<>();
                    while(resultSet.next())
                        result.add(new Similar(resultSet.getString(1), book, resultSet.getString(3)));

                    return result;
                }
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static List<Similar> getPossibleNewSimilarsOf(String username, String book) {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("SELECT bo.title FROM series bo " +
                    "LEFT JOIN similars si ON bo.title = si.similarbook AND si.book = ? " +
                    "AND si.username = ? " +
                    "WHERE si.book IS NULL AND bo.title <> ?")){
                ps.setString(1, book);
                ps.setString(2, username);
                ps.setString(3, book);

                try(ResultSet resultSet = ps.executeQuery()){
                    List<Similar> result = new ArrayList<>();
                    while(resultSet.next())
                        result.add(new Similar(username, book, resultSet.getString(1)));

                    return result;
                }
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean addSimilar() {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("INSERT " +
                    "INTO similars(username, book, similarbook) " +
                    " VALUES (?, ?, ?), (?, ?, ?)")){
                ps.setString(1, username);
                ps.setString(2, book);
                ps.setString(3, similar);
                ps.setString(4, username);
                ps.setString(5, similar);
                ps.setString(6, book);

                return excecuteUpdateCatchingError(ps) == 2;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean removeSimilar() {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("DELETE FROM similars " +
                    "where (username = ? and book = ? and similarbook = ?) "+
                    "or (username = ? and book = ? and similarbook = ?)")){
                ps.setString(1, username);
                ps.setString(2, book);
                ps.setString(3, similar);
                ps.setString(4, username);
                ps.setString(5, similar);
                ps.setString(6, book);

                return excecuteUpdateCatchingError(ps) == 2;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }
}
