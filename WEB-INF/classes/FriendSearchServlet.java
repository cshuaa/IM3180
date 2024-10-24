//Servlet for friend search bar function

import java.io.*;
import java.sql.*;
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/friend-search")
public class FriendSearchServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "myuser";
    private static final String DB_PASSWORD = "xxxx";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Ensure the response is set to JSON format
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        JSONArray friendsArray = new JSONArray();
        JSONArray friendRequestsArray = new JSONArray();
        JSONArray allUsersArray = new JSONArray();

        // Get username from request parameter (same as TaskServlet)
        String currentUser = request.getParameter("username");

        if (currentUser == null || currentUser.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User not authenticated.\"}");
            return;
        }

        // Fetch the user_id from the database using the username
        Integer currentUserId = getUserIdByUsername(currentUser);

        if (currentUserId == -1) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User not authenticated.\"}");
            return;
        }

        // Fetch friend data
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // Step 1: Get all users except the current user
            String userQuery = "SELECT user_id, username FROM Users WHERE user_id != ?";
            PreparedStatement userStmt = conn.prepareStatement(userQuery);
            userStmt.setInt(1, currentUserId);
            ResultSet userRs = userStmt.executeQuery();

            // Step 2: Get friends and pending requests for the current user
            String friendQuery = "SELECT * FROM Friendships f INNER JOIN Images i ON i.user_id = f.friend_id WHERE f.user_id = ?;";
            // "SELECT friend_id, status FROM Friendships WHERE user_id = ?";
            PreparedStatement friendStmt = conn.prepareStatement(friendQuery);
            friendStmt.setInt(1, currentUserId);
            ResultSet friendRs = friendStmt.executeQuery();

            HashSet<Integer> friendIds = new HashSet<>();
            while (friendRs.next()) {
                int friendId = friendRs.getInt("friend_id");
                String status = friendRs.getString("status");
                String imageURL = friendRs.getString("image_path");

                if (status.equals("accepted")) {
                    friendIds.add(friendId); // Store friend IDs
                    // Add friend to friendsArray
                    JSONObject friendJson = new JSONObject();
                    friendJson.put("id", friendId);
                    friendJson.put("name", getUserNameById(friendId, conn)); // Fetch username
                    friendJson.put("imageURL", imageURL);
                    friendsArray.put(friendJson);
                } else if (status.equals("pending")) {
                    JSONObject friendRequestJson = new JSONObject();
                    friendRequestJson.put("id", friendId);
                    friendRequestJson.put("name", getUserNameById(friendId, conn)); // Fetch username
                    friendRequestJson.put("imageURL", imageURL);
                    friendRequestsArray.put(friendRequestJson); // Store pending requests
                }
                System.out.println("FriendSearchServlet: " + imageURL);

            }

            // Step 3: Populate all users except the current user
            while (userRs.next()) {
                int userId = userRs.getInt("user_id");

                // Exclude only the current user
                if (userId != currentUserId) {
                    JSONObject userObject = new JSONObject();
                    userObject.put("id", userId);
                    userObject.put("name", userRs.getString("username"));

                    // Add an "isFriend" flag for frontend use
                    // boolean isFriend = friendIds.contains(userId);
                    // userObject.put("isFriend", isFriend);

                    allUsersArray.put(userObject); // Add to all users array
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Database error.\"}");
            out.flush();
            return;
        }

        // Step 4: Return JSON response
        JSONObject responseObject = new JSONObject();
        responseObject.put("friends", friendsArray);
        responseObject.put("friendRequests", friendRequestsArray);
        responseObject.put("allUsers", allUsersArray);

        out.print(responseObject.toString());
        out.flush();
    }

    // Helper function to fetch user_id from the database using username
    private int getUserIdByUsername(String username) {
        int userId = -1;
        try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement preparedStatement = conn
                        .prepareStatement("SELECT user_id FROM Users WHERE username = ?");) {
            preparedStatement.setString(1, username);
            ResultSet rset = preparedStatement.executeQuery();

            if (rset.next()) {
                userId = rset.getInt("user_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return userId;
    }

    // Helper function to fetch username by user_id
    private String getUserNameById(int userId, Connection conn) throws SQLException {
        String username = null;
        String query = "SELECT username FROM Users WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                username = rs.getString("username");
            }
        }
        return username;
    }
}
