var friends = [];
var friendRequests = [];
var allUsers = [];

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
        userNameDisplay.innerHTML = userNameDisplay.innerHTML.replace(
          "Username",
          username
        );
      }

      // Log the updated username and userid (optional)
      console.log("Retrieved userName:", username);
      console.log("Retrieved userId:", userid);

      // If a callback is provided, call it after fetching user data
      if (callback && typeof callback === "function") {
        callback(); // Now call the callback after retrieving user data
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

// Function to fetch friend data from the servlet
function fetchFriendData() {
  fetch(`/IM3180/friend-search?username=${encodeURIComponent(username)}`)
    .then((response) => {
      if (!response.ok) {
        // Handle HTTP errors
        return response.json().then((error) => {
          throw new Error(error.message || "Failed to fetch friend data");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Check the structure of data
      // Populate the friends, friendRequests, and allUsers arrays
      friends = data.friends.map((friend) => ({
        id: friend.id,
        name: friend.name,
        avatar: friend.imageURL,
      }));

      friendRequests = data.friendRequests.map((request) => ({
        id: request.id,
        name: request.name || "Unknown User", // Handle name if not available
        avatar: request.imageURL,
      }));

      allUsers = data.allUsers.map((user) => ({
        id: user.id,
        name: user.name,
      }));

      // Now load friends and friend requests
      loadFriends();
      //loadFriendRequests();
    })
    .catch((error) => console.error("Error fetching friend data:", error));
}

// Function to load friends dynamically
function loadFriends() {
  const friendList = document.getElementById("friendList");
  friendList.innerHTML = ""; // Clear the list

  friends.forEach((friend) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <img src="${friend.avatar}" alt="${friend.name}">
            <span>${friend.name}</span>
        `;
    friendList.appendChild(li);
  });
}

// Filter function for the friend search input
function filterFriends() {
  const searchInput = document
    .getElementById("friend-search-input")
    .value.toLowerCase();
  const dropdown = document.getElementById("friend-dropdown");

  dropdown.innerHTML = ""; // Clear existing dropdown content
  dropdown.style.display = "none"; // Hide dropdown initially

  if (searchInput) {
    // Filter the users based on the search input
    const filteredUsers = allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchInput)
    );

    console.log("Filtered Users:", filteredUsers);

    if (filteredUsers.length > 0) {
      dropdown.style.display = "block"; // Show dropdown when there are matches

      filteredUsers.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.className = "dropdown-item";

        // Check if the user exists in the friends array
        const isFriend = friends.some((friend) => friend.id === user.id); // Check if the user is already a friend
        console.log(`User: ${user.name}, isFriend: ${isFriend}`); // Debugging log

        userDiv.innerHTML = `
                    <span>${user.name}</span>
                    ${
                      isFriend
                        ? '<span class="added-text">Added</span>' // Show "Added" for friends
                        : `<button class="add-friend-btn" onclick="addFriend(${user.id})">Add</button>`
                    }`; // Show "Add" for non-friends

        dropdown.appendChild(userDiv);
      });
    }
  }
}

// Function to simulate adding a friend request
function addFriend(friendId) {
  const newFriend = allUsers.find((user) => user.id === friendId);
  if (newFriend) {
    friendRequests.push(newFriend);
    alert(`Friend request sent to ${newFriend.name}`);

    //loadFriendRequests(); // Reload the friend requests section
    document.getElementById("friend-dropdown").style.display = "none"; // Hide dropdown
  }
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

// Ensure friend list is loaded when the page is loaded
window.addEventListener("load", function () {
  getUserInfo(function () {
    // Fetch the username from the servlet on page load
    fetchFriendData(); // Fetch the data from the servlet only if username is loaded
    loadTasks(); // Load tasks only after username is retrieved
  });
});
