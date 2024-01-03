package servlets.data;

import db.data.Friend;
import db.data.Login;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import servlets.BasicServlet;

@WebServlet(name = "friends", value = BasicServlet.FRIENDS_PATH)
public class FriendsServlet extends BasicServlet<List<Friend>, Friend, Void, Friend> {

    @Override public List<Friend> doGet(HttpServletRequest request) {
        String username = Login.getCurrentLogin(request.getSession());
        return Friend.getFriendsOf(username);
    }
}
