import java.io.*;
import java.sql.*;
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.json.JSONObject;

@WebServlet("/loadprofile")
public class ProfileDataServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        PrintWriter out = response.getWriter();
        try (
                // Step 1: Allocate a database 'Connection' object
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                        "myuser", "xxxx"); // For MySQL

                // Step 2: Allocate a 'Statement' object in the Connection
                Statement stmt = conn.createStatement();) {

            // Retrieve session data from HttpSession
            HttpSession session = request.getSession();
            String userName = (String) session.getAttribute("userName");
            String userId = (String) session.getAttribute("userId");

            System.out.println("ProfileDataServlet: " + userName);
            System.out.println("ProfileDataServlet: " + userId);

            String sqlStr1 = "SELECT * FROM images WHERE user_id = ?;"; // Single-quote
            PreparedStatement preparedStatement = conn.prepareStatement(sqlStr1);
            preparedStatement.setString(1, userId);
            ResultSet rset = preparedStatement.executeQuery(); // Send the query to the server

            if (rset.next()) {
                // Create a JSON object to store the session details
                JSONObject jsonResponse = new JSONObject();
                String imagePath = rset.getString("image_path");
                jsonResponse.put("imagePath", imagePath);

                // Set response type to JSON
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");

                // Send the JSON response back to the client
                response.getWriter().write(jsonResponse.toString());
            }
        } catch (Exception ex) {
            out.println(ex.getMessage());
            out.println("<p>Check Tomcat console for details.</p>");
            ex.printStackTrace();
        } // Step 5: Close conn and stmt - Done automatically by try-with-resources (JDK
          // 7)
        out.close();
    }

    // The new doPost() runs the doGet() too
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response); // Re-direct POST request to doGet()
    }
}
