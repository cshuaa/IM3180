
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.*;
import java.sql.*;

@WebServlet("/friend-request")
public class FriendRequestServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "myuser";
    private static final String DB_PASSWORD = "xxxx";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String currentUser = request.getParameter("username");
        Integer currentUserId = getUserIdByUsername(currentUser); // Implemented already
        int friendId = Integer.parseInt(request.getParameter("id"));
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String query = "INSERT INTO Friendships (user_id, friend_id, status) VALUES (?, ?, 'pending')";
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setInt(1, currentUserId);
                stmt.setInt(2, friendId);
                stmt.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        response.setStatus(HttpServletResponse.SC_OK);
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
