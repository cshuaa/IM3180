import java.io.*;
import java.sql.*;
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.json.JSONObject;

@WebServlet("/roomdata")
public class RoomDataServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Retrieve session data from HttpSession
        HttpSession session = request.getSession();
        String sessionName = (String) session.getAttribute("sessionName");
        String sessionPassword = (String) session.getAttribute("sessionPassword");
        String userName = (String) session.getAttribute("userName");

        // Create a JSON object to store the session details
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("sessionName", sessionName);
        jsonResponse.put("sessionPassword", sessionPassword);
        jsonResponse.put("userName", userName);

        // Set response type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Send the JSON response back to the client
        response.getWriter().write(jsonResponse.toString());
    }

    // The new doPost() runs the doGet() too
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response); // Re-direct POST request to doGet()
    }
}
