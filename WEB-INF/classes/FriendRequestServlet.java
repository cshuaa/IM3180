import java.io.*;
import java.sql.*;
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/friend-req")
public class FriendRequestServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "myuser";
    private static final String DB_PASSWORD = "xxxx"; // Replace with your actual password

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Get the username from the request
        String username = request.getParameter("username");

        // Fetch the user_id from the database using the username
        int userId = getUserIdByUsername(username);

        if (userId == -1) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid user.");
            return;
        }

        String action = request.getParameter("action");

        // Handle adding a new task
        if ("accept".equals(action)) {
            int friendId = Integer.parseInt(request.getParameter("friendId")) ;

            // Update the friend request for one side
            String sql = "UPDATE friendships " +
             "SET status = ? " +
             "WHERE user_id = ? " +
             "AND friend_id = ?";
            try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ) {
                preparedStatement.setInt(3, friendId);
                preparedStatement.setInt(2, userId);
                preparedStatement.setString(1, "accepted");
                preparedStatement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }

            sql = "INSERT INTO friendships (user_id, friend_id, status)" +
            "VALUES (?,?,?)"; 
            try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ) {
                preparedStatement.setInt(1, friendId);
                preparedStatement.setInt(2, userId);
                preparedStatement.setString(3, "accepted");
                preparedStatement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }           

        // Handle deleting a task
        } else if ("decline".equals(action)) {
            String friendId = request.getParameter("friendId");
            String sql = "DELETE FROM friendships " +
            "WHERE user_id = ? " +
            "AND friend_id = ?";

            try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ) {
                preparedStatement.setString(2, friendId);
                preparedStatement.setInt(1, userId);
                preparedStatement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else if ("add".equals(action)) {
            String friendId = request.getParameter("friendId");
            String sql = "INSERT INTO friendships (user_id, friend_id, status)" +
            "VALUES (?,?,\'pending\')";

            try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement preparedStatement = conn.prepareStatement(sql);
            ) {
                preparedStatement.setString(1, friendId);
                preparedStatement.setInt(2, userId);
                preparedStatement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } 
        
        response.setStatus(HttpServletResponse.SC_OK);
        response.setHeader("Location", "/IM3180/virtual-study-webapp/frontend/pages/main-friends.html");

        
    }

    // Helper function to fetch user_id from the database using username
    private int getUserIdByUsername(String username) {
        int userId = -1;
        try (
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            PreparedStatement preparedStatement = conn.prepareStatement("SELECT user_id FROM Users WHERE username = ?");
        ) {
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


}

