package servlets.data;

import datasource.data.Friend;
import datasource.data.Login;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import json.errors.LoggableError;
import servlets.BasicServlet;

import java.io.IOException;
import java.util.List;

import static servlets.BasicServlet.FRIENDS_PATH;

@WebServlet(name = "friends", value = FRIENDS_PATH)
public class FriendsServlet extends BasicServlet<List<Friend>, Friend, Friend> {

    @Override public List<Friend> doGet(HttpServletRequest req) {
        String username = getLogged(req.getSession());
        String inverse = req.getParameter("inverse");
        if("yes".equals(inverse))
            return Friend.getPossibleNewFriendsOf(username);
        return Friend.getFriendsOf(username);
    }

    @Override public Friend doPost(HttpServletRequest req) throws IOException{
        Friend friend = gson.fromJson(req.getReader(), Friend.class);

        if(!friend.isValid())
            throw new LoggableError("Cannot make friends with same user or with no user");

        if(!friend.addFriendship())
            throw new LoggableError("Coudn't add friendship (maybe user doesn't exist or friendship already exist)");
        return friend;
    }

    @Override public Friend doDelete(HttpServletRequest req) throws IOException{
        Friend friend = gson.fromJson(req.getReader(), Friend.class);

        if(!friend.removeFriendship())
            throw new LoggableError("Coudn't remove friendship (friendship doesn't exist)");
        return friend;
    }
}
