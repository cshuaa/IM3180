
// To save as "ebookshop\WEB-INF\classes\QueryServlet.java".
import java.io.*;
import java.sql.*;
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.json.JSONObject;
//import javax.servlet.*;            // Tomcat 9
//import javax.servlet.http.*;
//import javax.servlet.annotation.*;

@WebServlet("/saveprofile") // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class SaveProfileServlet extends HttpServlet {

    // The doGet() runs once per HTTP GET request to this servlet.
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Set the MIME type for the response message
        response.setContentType("text/html");
        // Get a output writer to write the response message into the network socket
        PrintWriter out = response.getWriter();
        String userId = "", userName = "", profileIconURL = "";
        // Print an HTML page as the output of the query
        out.println("<html>");
        out.println("<head>");
        out.println("<meta charset=\"UTF-8\">");
        out.println("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">");
        out.println("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
        // out.println("<script src=\"assets/jquery-3.5.1.min.js\"></script>");
        // out.println("<script
        // src=\"assets/bootstrap-5.0.2-dist/bootstrap-5.0.2-dist/js/bootstrap.bundle.min.js\"></script>");
        // out.println(
        // "<link rel=\"stylesheet\"
        // href=\"assets/bootstrap-5.0.2-dist/bootstrap-5.0.2-dist/css/bootstrap.min.css\">");
        out.println(
                "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH\" crossorigin=\"anonymous\">");
        out.println(
                "<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz\" crossorigin=\"anonymous\"></script>");
        out.println("<script src=\"virtual-study-webapp/scripts/sweetalert2.all.min.js\"></script>");
        out.println("<title>Cloudy</title>");
        out.println("</head>");
        out.println("<body>");

        try (
                // Step 1: Allocate a database 'Connection' object
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                        "myuser", "xxxx"); // For MySQL

                // Step 2: Allocate a 'Statement' object in the Connection
                Statement stmt = conn.createStatement();) {

            // Store session data in HttpSession
            HttpSession session = request.getSession();
            profileIconURL = request.getParameter("image_path");
            session.setAttribute("profileIcon", profileIconURL);
            userName = (String) session.getAttribute("userName");
            userId = (String) session.getAttribute("userId");

            System.out.println("SaveProfileServlet userName: " + userName);
            System.out.println("SaveProfileServlet userId: " + userId);
            System.out.println("SaveProfileServlet profileIconURL: " + profileIconURL);

            String sqlStr1 = "DELETE FROM images WHERE user_id = ?;"; // Single-quote
            PreparedStatement preparedStatement = conn.prepareStatement(sqlStr1);
            preparedStatement.setString(1, userId);
            preparedStatement.executeUpdate(); // Send the query to the server

            // Step 3: Execute a SQL SELECT query
            String sqlStr2 = "INSERT INTO images (user_id, image_path) VALUES (?, ?);"; // Single-quote
            PreparedStatement preparedStatement2 = conn.prepareStatement(sqlStr2);

            // Set parameters for the prepared statement
            preparedStatement2.setString(1, userId);
            preparedStatement2.setString(2, profileIconURL);

            preparedStatement2.executeUpdate(); // Send the query to the server

            // Redirect to video-room.html
            response.sendRedirect("virtual-study-webapp/frontend/pages/video-room.html");

        } catch (Exception ex) {
            out.println("<script type=\"text/javascript\">");
            out.println("Swal.fire({\r\n" + //
                    "  icon: \"error\",\r\n" + //
                    "  title: \"Something went wrong!\",\r\n" + //
                    "  showConfirmButton: false,\r\n" + //
                    "  timer: 3000\r\n" + //
                    "});");
            out.println("</script>");
            out.println("<p>Error: " + ex.getMessage() + "</p>");
            out.println("<p>Check Tomcat console for details.</p>");
            ex.printStackTrace();
        } // Step 5: Close conn and stmt - Done automatically by try-with-resources (JDK
          // 7)

        out.println("</body></html>");
        out.close();
    }

    // The new doPost() runs the doGet() too
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response); // Re-direct POST request to doGet()
    }
}