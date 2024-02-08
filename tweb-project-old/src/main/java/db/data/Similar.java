package db.data;

import db.ManagerDB;

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

    public static List<Similar> getSimilarsOf(String book) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select * from similars where book = ?");
            ps.setString(1, book);

            ResultSet resultSet = ps.executeQuery();
            List<Similar> result = new ArrayList<>();
            while(resultSet.next()){
                Similar tmp = new Similar(resultSet.getString(1), book, resultSet.getString(3));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static List<Similar> getPossibleNewSimilarsOf(String username, String book) { //TODO FUSE
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select bo.title from series bo " +
                    "left join similars si on bo.title = si.similarbook and si.book = ? " +
                    "and si.username = ? " +
                    "where si.book is null and bo.title <> ?");
            ps.setString(1, book);
            ps.setString(2, username);
            ps.setString(3, book);

            ResultSet resultSet = ps.executeQuery();
            List<Similar> result = new ArrayList<>();
            while(resultSet.next()){
                Similar tmp = new Similar(username, book, resultSet.getString(1));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean isValid() {
        return username != null && book != null && similar != null;
    }

    public boolean addSimilar() {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO similars(username, book, similarbook) " +
                        " VALUES (?, ?, ?), (?, ?, ?)");
            ps.setString(1, username);
            ps.setString(2, book);
            ps.setString(3, similar);
            ps.setString(4, username);
            ps.setString(5, similar);
            ps.setString(6, book);

            return ps.executeUpdate() == 2;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean removeSimilar() {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM similars " +
                            "where (username = ? and book = ? and similarbook = ?) "+
                            "or (username = ? and book = ? and similarbook = ?)");
            ps.setString(1, username);
            ps.setString(2, book);
            ps.setString(3, similar);
            ps.setString(4, username);
            ps.setString(5, similar);
            ps.setString(6, book);


            return ps.executeUpdate() == 2;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }
}
