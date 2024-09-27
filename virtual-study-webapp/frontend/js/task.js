document.addEventListener('DOMContentLoaded', function () {
    let username = "";

    // Get elements from the DOM
    const addTaskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('task-list');

    // Step 1: Get username and load tasks
    function getUserName(callback) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/IM3180/userdata", true); // Replace with the correct path to the servlet
        xhr.onload = function () {
            if (xhr.status === 200) {
                const userData = JSON.parse(xhr.responseText);
                username = userData.userName;
                document.getElementById("userName").textContent = username; // Display username if necessary
                if (callback) callback();
            } else {
                console.error("Error fetching session data");
            }
        };
        xhr.send();
    }

    // Step 2: Load tasks from backend
    function loadTasks() {
        fetch(`/IM3180/tasks?username=${username}`)
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = ''; // Clear existing tasks
                tasks.forEach((task, index) => addTaskToList(task.task, task.taskId, index + 1, false));
            });
    }

    // Step 3: Add tasks dynamically and sync with backend
    function addTask(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            // Add task to backend
            fetch(`/IM3180/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ task: taskText, username: username, action: "add" })
            }).then(response => {
                if (response.ok) {
                    taskInput.value = ''; // Clear input field
                    loadTasks(); // Reload tasks after adding
                } else {
                    alert("Failed to add task.");
                }
            });
        }
    }

    // Step 4: Delete task
    function deleteTask(taskId, taskItem) {
        fetch(`/IM3180/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ task_id: taskId, username: username, action: "delete" })
        }).then(response => {
            if (response.ok) {
                removeTask(taskItem); // Remove from the UI
                renumberTasks(); // Renumber tasks
            } else {
                alert("Failed to delete task.");
            }
        });
    }

    // Step 5: Add a task to the list (UI)
    function addTaskToList(taskText, taskId, taskNumber, isNew = true) {
        const newTaskItem = document.createElement('li');
        newTaskItem.classList.add('task-item');

        // Task label with number
        const taskLabel = document.createElement('span');
        taskLabel.textContent = `${taskNumber}. ${taskText}`;

        // Checkbox
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.classList.add('task-checkbox');
        taskCheckbox.addEventListener('change', function () {
            if (this.checked) {
                newTaskItem.style.backgroundColor = '#88d698'; // Green on completion
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

    // Step 6: Remove task from the UI
    function removeTask(taskItem) {
        taskList.removeChild(taskItem);
    }

    // Step 7: Renumber tasks after deletion
    function renumberTasks() {
        const tasks = taskList.children;
        for (let i = 0; i < tasks.length; i++) {
            const taskLabel = tasks[i].querySelector('span');
            taskLabel.textContent = `${i + 1}. ${taskLabel.textContent.split('. ')[1]}`;
        }
    }

    // Step 8: Initialize the page, load username and tasks
    getUserName(function () {
        loadTasks(); // Load tasks after username is retrieved
        addTaskForm.addEventListener('submit', addTask); // Add event listener for task form submission
    });
});
