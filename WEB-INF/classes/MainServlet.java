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

@WebServlet("/MainServlet")
public class MainServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "myuser";
    private static final String DB_PASSWORD = "xxxx";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        JSONArray activeRoomsArray = new JSONArray();  // To store the active rooms

        // Query to get active rooms from the database
        String query = "SELECT active_room_id, room_name FROM Active_Room";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                JSONObject activeRoom = new JSONObject();
                activeRoom.put("active_room_id", rs.getInt("active_room_id"));
                activeRoom.put("room_name", rs.getString("room_name"));
                activeRoomsArray.put(activeRoom);  // Add active room to JSON array
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        out.print(activeRoomsArray.toString());
        out.flush();
    }
}

