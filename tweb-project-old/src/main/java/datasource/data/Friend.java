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

    public static List<Friend> getFriendsOf(String username) {
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select friend from friends where username = ?");
            ps.setString(1, username);

            ResultSet resultSet = ps.executeQuery();
            List<Friend> result = new ArrayList<>();
            while(resultSet.next()){
                Friend tmp = new Friend(username, resultSet.getString(1));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public static List<Friend> getPossibleNewFriendsOf(String username) { //TODO FUSE
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement("select u.username from users u " +
                    "left join friends f on u.username = f.friend and f.username = ? " +
                    "where f.username is null and u.username <> ? and u.issuperuser = false");
            ps.setString(1, username);
            ps.setString(2, username);

            ResultSet resultSet = ps.executeQuery();
            List<Friend> result = new ArrayList<>();
            while(resultSet.next()){
                Friend tmp = new Friend(username, resultSet.getString(1));
                result.add(tmp);
            }

            return result;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean addFriendship(){
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO friends(username, friend) VALUES (?, ?)");
            ps.setString(1, username);
            ps.setString(2, friend);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean removeFriendship(){
        try(Connection conn = getConn()){
            PreparedStatement ps = conn.prepareStatement(
                    "DELETE FROM friends where (username = ? and friend = ?)");
            ps.setString(1, username);
            ps.setString(2, friend);

            return ps.executeUpdate() == 1;
        }catch (SQLException sqlException){ throw sqlError(sqlException.getMessage()); }
    }

    public boolean isValid() {
        return username != null && friend != null && !username.equals(friend);
    }
}