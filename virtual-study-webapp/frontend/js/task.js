let username = "";
let userid = "";

// Function to get user information
function getUserInfo(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../../../userdata", true); // Ensure this path is correct

  xhr.onload = function () {
    if (xhr.status === 200) {
      // Parse the JSON response
      const userData = JSON.parse(xhr.responseText);

      // Log user data to check values (optional)
      console.log(userData);

      // Set global variables with the retrieved data
      username = userData.userName;
      userid = userData.userId;

      // Update the username display in the DOM
      const userNameDisplay = document.querySelector("a.username");
      if (userNameDisplay) {
        userNameDisplay.innerHTML = userNameDisplay.innerHTML.replace("Username", username);
      }

      // Log the updated username and userid (optional)
      console.log("Retrieved userName:", username);
      console.log("Retrieved userId:", userid);

      // If a callback is provided, call it after fetching user data
      if (callback && typeof callback === "function") {
        callback();  // Now call the callback after retrieving user data
      }
    } else {
      console.error("Error fetching session data. Status code:", xhr.status);
    }
  };

  xhr.onerror = function () {
    console.error("Request failed");
  };

  xhr.send();
}

// Function to load tasks for the user
function loadTasks() {
  fetch(`/IM3180/tasks?username=${username}`)
    .then((response) => response.json())
    .then((tasks) => {
      const taskList = document.getElementById("task-list");
      taskList.innerHTML = ""; // Clear the existing list
      tasks.forEach((task, index) => {
        addTaskToList(task.task, task.taskId, index + 1, false); // Use addTaskToList to render tasks
      });
    });
}

// Function to handle deleting a task
function deleteTask(taskId, taskItem = null) {
  fetch(`/IM3180/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      task_id: taskId,
      username: username,
      action: "delete",
    }),
  }).then((response) => {
    if (response.ok) {
      if (taskItem) removeTask(taskItem); // Remove task from UI
      renumberTasks(); // Renumber tasks after deletion
      loadTasks(); // Reload tasks from the backend
    } else {
      alert("Failed to delete task.");
    }
  });
}

// Function to handle adding a task
function addTask(event) {
  event.preventDefault();
  const taskInput = document.getElementById("taskInput").value;

  fetch(`/IM3180/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      task: taskInput,
      username: username,
      action: "add",
    }),
  }).then((response) => {
    if (response.ok) {
      document.getElementById("taskInput").value = ""; // Clear input field
      loadTasks(); // Reload tasks after adding
    } else {
      alert("Failed to add task.");
    }
  });
}

// Function to add a task to the list (UI)
function addTaskToList(taskText, taskId, taskNumber, isNew = true) {
  const taskList = document.getElementById("task-list");
  const newTaskItem = document.createElement("li");
  newTaskItem.classList.add("task-item");

  // Task label with number
  const taskLabel = document.createElement("span");
  taskLabel.textContent = `${taskNumber}. ${taskText}`;

  // Checkbox
  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.classList.add("task-checkbox");
  taskCheckbox.addEventListener("change", function () {
    if (this.checked) {
      newTaskItem.style.backgroundColor = "#88d698"; // Green on completion
      setTimeout(() => {
        deleteTask(taskId, newTaskItem); // Delete after short delay
      }, 500); // Adjust delay as needed
    }
  });

  // Append label and checkbox
  newTaskItem.appendChild(taskLabel);
  newTaskItem.appendChild(taskCheckbox);

  // Add the new task to the task list
  taskList.appendChild(newTaskItem);

  if (isNew) {
    renumberTasks(); // Renumber if new tasks are added
  }
}

// Remove task from the UI
function removeTask(taskItem) {
  const taskList = document.getElementById("task-list");
  taskList.removeChild(taskItem);
}

// Renumber tasks after deletion or addition
function renumberTasks() {
  const taskList = document.getElementById("task-list");
  const tasks = taskList.children;
  for (let i = 0; i < tasks.length; i++) {
    const taskLabel = tasks[i].querySelector("span");
    taskLabel.textContent = `${i + 1}. ${taskLabel.textContent.split(". ")[1]}`;
  }
}

// Load tasks when the page loads
window.onload = function () {
  getUserInfo(function () {
    loadTasks(); // Load tasks only after username is retrieved

    // Add event listener to the add task form
    const addTaskForm = document.getElementById("addTaskForm");
    addTaskForm.addEventListener("submit", addTask);
  });
};
