//servlet contain function for adding room information to the json array 
//to be fetched by the main-home.html search bar
import java.io.*;
import java.sql.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
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

        // Set response type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        JSONArray publicRoomsArray = new JSONArray();
        JSONArray privateRoomsArray = new JSONArray();

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // Step 1: Fetch public rooms
            String publicRoomsQuery = "SELECT active_room_id, room_name, username FROM Active_Room WHERE public = true";
            try (PreparedStatement publicStmt = conn.prepareStatement(publicRoomsQuery);
                 ResultSet publicRs = publicStmt.executeQuery()) {

                while (publicRs.next()) {
                    JSONObject room = new JSONObject();
                    room.put("id", publicRs.getInt("active_room_id"));
                    room.put("room_name", publicRs.getString("room_name"));
                    room.put("username", publicRs.getString("username"));
                    publicRoomsArray.put(room);
                }
            }

            // Step 2: Fetch private rooms
            String privateRoomsQuery = "SELECT active_room_id, room_name, username FROM Active_Room WHERE public = false";
            try (PreparedStatement privateStmt = conn.prepareStatement(privateRoomsQuery);
                 ResultSet privateRs = privateStmt.executeQuery()) {

                while (privateRs.next()) {
                    JSONObject room = new JSONObject();
                    room.put("id", privateRs.getInt("active_room_id"));
                    room.put("room_name", privateRs.getString("room_name"));
                    room.put("username", privateRs.getString("username"));
                    privateRoomsArray.put(room);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Database error.\"}");
            out.flush();
            return;
        }

        // Step 3: Return JSON response
        JSONObject responseObject = new JSONObject();
        responseObject.put("publicRooms", publicRoomsArray);
        responseObject.put("privateRooms", privateRoomsArray);

        out.print(responseObject.toString());
        out.flush();
    }
}

