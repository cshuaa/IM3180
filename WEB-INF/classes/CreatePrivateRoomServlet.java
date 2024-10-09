
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

@WebServlet("/createprivateroom") // Configure the request URL for this servlet (Tomcat 7/Servlet 3.0 upwards)
public class CreatePrivateRoomServlet extends HttpServlet {

    // The doGet() runs once per HTTP GET request to this servlet.
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Set the MIME type for the response message
        response.setContentType("text/html");
        // Get a output writer to write the response message into the network socket
        PrintWriter out = response.getWriter();
        String sessionName = "", sessionPassword = "", message = "", userName = "";
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

        try {

            sessionName = request.getParameter("sessionName");
            sessionPassword = request.getParameter("sessionPassword");
            userName = request.getParameter("userName");

            System.out.println("CreatePrivateRoomServlet sessionName: " + sessionName);
            System.out.println("CreatePrivateRoomServlet sessionPassword: " + sessionPassword);
            System.out.println("CreatePrivateRoomServlet userName: " + userName);

            // Store session data in HttpSession
            HttpSession session = request.getSession();
            session.setAttribute("sessionName", sessionName);
            session.setAttribute("sessionPassword", sessionPassword);
            session.setAttribute("userName", userName);
            session.setAttribute("public", false);

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