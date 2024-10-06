//servlet contain function for adding room information to the json array 
//to be fetched by the main-home.html search bar
import java.io.*;
import java.sql.*;
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/MainServlet")  // Define the servlet mapping as "MainServlet"
public class MainServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "myuser";
    private static final String DB_PASSWORD = "xxxx";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        JSONArray sessionsArray = new JSONArray();  // To store the sessions

        // Query to get sessions from the database
        String query = "SELECT session_id, session_name FROM Sessions";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                JSONObject session = new JSONObject();
                session.put("session_id", rs.getInt("session_id"));
                session.put("session_name", rs.getString("session_name"));
                sessionsArray.put(session);  // Add session to JSON array
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        out.print(sessionsArray.toString());
        out.flush();
    }
}
