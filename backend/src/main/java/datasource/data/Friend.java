package datasource.data;

import datasource.ManagerDB;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Friend extends ManagerDB {
    private final String username;
    private final String friend;

    public Friend(String username, String friend){
        this.username = username;
        this.friend = friend;
    }

    public boolean isValid() {
        return username != null && friend != null && !username.equals(friend);
    }

    public static List<Friend> getFriendsOf(String username) {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("SELECT friend FROM friends WHERE username = ?")){
                ps.setString(1, username);

                try(ResultSet resultSet = ps.executeQuery()){
                    List<Friend> result = new ArrayList<>();
                    while(resultSet.next())
                        result.add(new Friend(username, resultSet.getString(1)));

                    return result;
                }
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static List<Friend> getPossibleNewFriendsOf(String username) {
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement("SELECT u.username FROM users u " +
                    "LEFT JOIN friends f ON u.username = f.friend AND f.username = ? " +
                    "WHERE f.username IS NULL AND u.username <> ? AND u.issuperuser = false")){
                ps.setString(1, username);
                ps.setString(2, username);

                try(ResultSet resultSet = ps.executeQuery()){
                    List<Friend> result = new ArrayList<>();
                    while(resultSet.next())
                        result.add(new Friend(username, resultSet.getString(1)));

                    return result;
                }
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean addFriendship(){
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO friends(username, friend) VALUES (?, ?)")){
                ps.setString(1, username);
                ps.setString(2, friend);

                return excecuteUpdateCatchingError(ps) == 1;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean removeFriendship(){
        try(Connection conn = getConn()){
            try(PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM friends where (username = ? and friend = ?)")){
                ps.setString(1, username);
                ps.setString(2, friend);

                return excecuteUpdateCatchingError(ps) == 1;
            }
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }
}
