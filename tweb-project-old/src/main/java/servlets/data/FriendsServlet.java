package servlets.data;

import db.data.Friend;
import db.data.Login;
import java.io.IOException;
import java.util.List;
import java.util.Scanner;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;
import static servlets.BasicServlet.FRIENDS_PATH;

@WebServlet(name = "friends", value = FRIENDS_PATH)
public class FriendsServlet extends BasicServlet<List<Friend>, Friend, Void, Friend> {

    @Override public List<Friend> doGet(HttpServletRequest request) {
        String username = Login.getCurrentLogin(request.getSession());
        return Friend.getFriendsOf(username);
    }

    @Override public Friend doPost(HttpServletRequest request) throws IOException{
        String username = Login.getCurrentLogin(request.getSession());
        String friendName = new Scanner(request.getReader()).next();

        if(username.equals(friendName))
            throw new LoggableError("Cannot make friends with same user");

        Friend friend = new Friend(username, friendName);
        if(!friend.addFriendship())
            throw new LoggableError("Coudn't add friendship (maybe user doesn't exist or friendship already exist)");
        return friend;
    }

    @Override public Friend doDelete(HttpServletRequest request) throws IOException{
        String username = Login.getCurrentLogin(request.getSession());
        String friendName = new Scanner(request.getReader()).next();

        if(username.equals(friendName))
            throw new LoggableError("Cannot remove friendship with same user");

        Friend friend = new Friend(username, friendName);
        if(!friend.removeFriendship())
            throw new LoggableError("Coudn't remove friendship (friendship doesn't exist)");
        return friend;
    }
}
