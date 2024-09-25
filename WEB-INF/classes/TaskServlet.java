import java.io.*;
import java.sql.*;
import jakarta.servlet.*; // Tomcat 10
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/tasks")
public class TaskServlet extends HttpServlet {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/cloudydb?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "myuser";
    private static final String DB_PASSWORD = "xxxx"; // Replace with your actual password

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Get the username from the request
        String username = request.getParameter("username");

        // Fetch the user_id from the database using the username
        int userId = getUserIdByUsername(username);

        if (userId == -1) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid user.");
            return;
        }

        String action = request.getParameter("action");

        // Handle adding a new task
        if ("add".equals(action)) {
            String task = request.getParameter("task");

            try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement preparedStatement = conn.prepareStatement("INSERT INTO Tasks (user_id, task) VALUES (?, ?)");
            ) {
                preparedStatement.setInt(1, userId);
                preparedStatement.setString(2, task);
                preparedStatement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }

        // Handle deleting a task
        } else if ("delete".equals(action)) {
            int taskId = Integer.parseInt(request.getParameter("task_id"));

            try (
                Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement preparedStatement = conn.prepareStatement("DELETE FROM Tasks WHERE task_id = ?");
            ) {
                preparedStatement.setInt(1, taskId);
                preparedStatement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // After adding or deleting, reload the updated task list
        doGet(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Get the username from the request
        String username = request.getParameter("username");

        // Fetch the user_id from the database using the username
        int userId = getUserIdByUsername(username);

        if (userId == -1) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid user.");
            return;
        }

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        List<Task> tasks = new ArrayList<>();
        try (
            Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            PreparedStatement preparedStatement = conn.prepareStatement("SELECT * FROM Tasks WHERE user_id = ?");
        ) {
            preparedStatement.setInt(1, userId);
            ResultSet rset = preparedStatement.executeQuery();

            while (rset.next()) {
                int taskId = rset.getInt("task_id");
                String task = rset.getString("task");
                tasks.add(new Task(taskId, userId, task));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Convert tasks to JSON array and send response
        JSONArray jsonArray = new JSONArray();
        for (Task task : tasks) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("taskId", task.taskId);
            jsonObject.put("userId", task.userId);
            jsonObject.put("task", task.task);
            jsonArray.put(jsonObject);
        }

        out.print(jsonArray.toString());
        out.flush();
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

    // Helper class to represent tasks
    class Task {
        int taskId;
        int userId;
        String task;

        public Task(int taskId, int userId, String task) {
            this.taskId = taskId;
            this.userId = userId;
            this.task = task;
        }
    }
}

