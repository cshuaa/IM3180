
// To save as "ebookshop\WEB-INF\classes\QueryServlet.java".
import java.io.*;
import java.sql.*;
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
//import javax.servlet.*;            // Tomcat 9
//import javax.servlet.http.*;
//import javax.servlet.annotation.*;

@WebServlet("/register") // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class RegisterServlet extends HttpServlet {

    // The doGet() runs once per HTTP GET request to this servlet.
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Set the MIME type for the response message
        response.setContentType("text/html");
        // Get a output writer to write the response message into the network socket
        PrintWriter out = response.getWriter();
        // Print an HTML page as the output of the query
        out.println("<html>");
        out.println("<head><title>Query Response</title>");
        out.println(
                "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH\" crossorigin=\"anonymous\">");
        out.println(
                "<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz\" crossorigin=\"anonymous\"></script>");
        out.println("<script src=\"virtual-study-webapp/scripts/sweetalert2.all.min.js\"></script>");
        out.println("</head>");
        out.println("<body>");
        String message = "";
        try (
                // Step 1: Allocate a database 'Connection' object
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC",
                        "myuser", "xxxx"); // For MySQL
                // The format is: "jdbc:mysql://hostname:port/databaseName", "username",
                // "password"

                // Step 2: Allocate a 'Statement' object in the Connection
                Statement stmt = conn.createStatement();) {

            // Step 3: Execute a SQL SELECT query
            String sqlStr1 = "SELECT * from users WHERE username = ?";
            PreparedStatement preparedStatement = conn.prepareStatement(sqlStr1);
            // Set parameter for the prepared statement
            preparedStatement.setString(1, request.getParameter("username"));        
            ResultSet rset = preparedStatement.executeQuery();; // Send the query to the server

            // Check if new user
            if (!rset.isBeforeFirst()) {
                String sqlStr2 = "INSERT INTO users (username, user_email, password) VALUES ('"
                        + request.getParameter("username") + "', '" + request.getParameter("user_email") + "', '" + request.getParameter("password") + "')";
                int count = stmt.executeUpdate(sqlStr2);

                message = "Please log into your account";
                out.println("<script type=\"text/javascript\">");
                out.println("Swal.fire({\r\n" + //
                        "  title: \"Account has been created successfully!\",\r\n" + //
                        "  text: \"" + message + "\",\r\n" + //
                        "  allowOutsideClick: false,\r\n" + //
                        "  allowEscapeKey: false,\r\n" + //
                        "  allowEnterKey: false,\r\n" + //
                        "  icon: \"success\",\r\n" + //
                        "}).then((result) => {\r\n" + //
                        "  if (result.isConfirmed) {\r\n" + //
                        " location = 'virtual-study-webapp/frontend/pages/login.html';" +
                        "  }\r\n" + //
                        "});");
                out.println("</script>");
                // out.println("<p>Your SQL statement is: " + sqlStr2 + "," + count + "record
                // inserted.</p>"); // Echo for // debugging
            } else {
                message = "Please log into your account";
                out.println("<script type=\"text/javascript\">");
                out.println("Swal.fire({\r\n" + //
                        "  title: \"User already exists!\",\r\n" + //
                        "  text: \"" + message + "\",\r\n" + //
                        "  allowOutsideClick: false,\r\n" + //
                        "  allowEscapeKey: false,\r\n" + //
                        "  allowEnterKey: false,\r\n" + //
                        "  icon: \"warning\",\r\n" + //
                        "}).then((result) => {\r\n" + //
                        "  if (result.isConfirmed) {\r\n" + //
                        " location = 'virtual-study-webapp/frontend/pages/login.html';" +
                        "  }\r\n" + //
                        "});");
                out.println("</script>");
                // out.println("<p>" + request.getParameter("username") + " already
                // exists!</p>");
            }
        } catch (Exception ex) {
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