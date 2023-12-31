package db.data;

import db.ManagerDB;
import json.errors.FatalError;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Friend extends ManagerDB {
    private final String username;

    public Friend(String username){ this.username = username; }
    public String getUsername() { return username; }

    public static List<Friend> getFriendsOf(String username) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select friend from friends where username = ?");
            ps.setString(1, username);

            ResultSet resultSet = ps.executeQuery();
            List<Friend> result = new ArrayList<>();
            while(resultSet.next()){
                Friend tmp = new Friend(resultSet.getString(0));
                result.add(tmp);
            }

            return result;
        }catch (SQLException ignored){ throw sqlError(); }
    }


}
