import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/notifications")
public class NotificationServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Set response content type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Create a JSON array to hold the notification objects
        JSONArray jsonNotifications = new JSONArray();

        try (Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                "myuser", "xxxx")) {

            // Retrieve session data from HttpSession
            HttpSession session = request.getSession();
            String userName = (String) session.getAttribute("userName");

            String sql = "SELECT * FROM notifications WHERE receiver_username = ?";
            PreparedStatement preparedStatement = conn.prepareStatement(sql);
            preparedStatement.setString(1, userName);
            ResultSet rs = preparedStatement.executeQuery();

            // Fetch each record from the result set and add it to the JSON array
            while (rs.next()) {
                JSONObject jsonNotification = new JSONObject();
                jsonNotification.put("noti_id", rs.getInt("noti_id"));
                jsonNotification.put("sender_username", rs.getString("sender_username"));
                jsonNotification.put("receiver_username", rs.getString("receiver_username"));
                jsonNotification.put("notification", rs.getString("notification"));
                jsonNotification.put("status", rs.getString("status"));

                // Add each notification to the JSON array
                jsonNotifications.put(jsonNotification);
            }

            // Write the JSON array to the response
            PrintWriter out = response.getWriter();
            out.print(jsonNotifications.toString());
            out.flush();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // The new doPost() runs the doGet() too
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response); // Re-direct POST request to doGet()
    }
}
