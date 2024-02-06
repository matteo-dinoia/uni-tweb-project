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
}
