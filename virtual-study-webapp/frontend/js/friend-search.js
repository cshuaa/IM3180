var friends = [];
var friendRequests = [];
var allUsers = [];

let username = "";
let userid = "";

function callback() {
  console.log("Callback function executed successfully.");
}

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
      loadFriendRequests();
    })
    .catch((error) => console.error("Error fetching friend data:", error));
}

// Function to load friend requests dynamically with Accept and Decline buttons
function loadFriendRequests() {
  const requestList = document.getElementById("requestList");
  requestList.innerHTML = ""; // Clear the list

  friendRequests.forEach((request) => {
    const li = document.createElement("li");
    console.log(
      "Notifications: " +
        request.avatar +
        ", " +
        +request.name +
        ", " +
        request.id
    );
    li.innerHTML = `
              <img src="${request.avatar}" alt="${request.name}">
              <span>${request.name}</span>
              <button class="accept-friend-btn" onclick="acceptFriendRequest(${request.id})">Accept</button>
              <button class="decline-friend-btn" onclick="declineFriendRequest(${request.id})">Decline</button>
          `;
    requestList.appendChild(li);
  });

  // Update the red notification dot
  updateFriendNotificationDot();
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
    console.log("Friend image: " + friend.avatar);
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

        // Check if the user exists in the friends array or friendRequests array
        const isFriend = friends.some((friend) => friend.id === user.id); // Check if the user is already a friend
        const isRequested = friendRequests.some(
          (request) => request.id === user.id
        ); // Check if the user is in friendRequests

        console.log(
          `User: ${user.name}, isFriend: ${isFriend}, isRequested: ${isRequested}`
        ); // Debugging log

        // Show "Added" if the user is already a friend or if a friend request has been sent
        userDiv.innerHTML = `
                    <span>${user.name}</span>
                    ${
                      isFriend || isRequested
                        ? '<span class="added-text">Added</span>' // Show "Added" for friends or friend requests
                        : `<button class="add-friend-btn" onclick="addFriend(${user.id})">Add</button>`
                    }`; // Show "Add" for non-friends

        dropdown.appendChild(userDiv);
      });
    }
  }


// Function to simulate adding a friend request
// TODO: send to Friendreq
function addFriend(friendId) {
  const newFriend = allUsers.find((user) => user.id === friendId);
  if (newFriend) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `/IM3180/friend-req?username=${username}&action=add&friendId=${friendId}`,
      true
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        const redirectUrl = xhr.getResponseHeader("Location");
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          console.error("Redirect URL not found");
        }
      } else {
        console.error("Error fetching session data");
      }
    };
    xhr.send();

    //friendRequests.push(newFriend);
    //alert(`Friend request sent to ${newFriend.name}`);

    //loadFriendRequests(); // Reload the friend requests section
    //document.getElementById('friend-dropdown').style.display = 'none'; // Hide dropdown
  }
}

// Ensure friend list is loaded when the page is loaded
window.addEventListener("load", function () {
  getUserInfo(function () {
    // Fetch the username from the servlet on page load
    fetchFriendData(); // Fetch the data from the servlet only if username is loaded
  });
});

// Function to accept a friend request
function acceptFriendRequest(requestId) {
  const friendToAdd = friendRequests.find(
    (request) => request.id === requestId
  );
  if (friendToAdd) {
    // friends.push(friendToAdd);
    // friendRequests = friendRequests.filter(request => request.id !== requestId);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/IM3180/friend-req?username=${username}&action=accept&friendId=${requestId}`, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const redirectUrl = xhr.getResponseHeader("Location");
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                console.error("Redirect URL not found");
            }
        } else {
            console.error("Error fetching session data");
        }
    };
    xhr.send();

    //loadFriends(); // Reload the friends list
    //loadFriendRequests(); // Reload friend requests
    alert(`You accepted the friend request from ${friendToAdd.name}`);
  }
  updateFriendNotificationDot();
}

// Function to decline a friend request
function declineFriendRequest(requestId) {
  friendRequests = friendRequests.filter((request) => request.id !== requestId);
  //loadFriendRequests();
  //alert('You declined the friend request');

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/IM3180/friend-req?username=${username}&action=decline&friendId=${requestId}`, true);
  xhr.onload = function () {
      if (xhr.status === 200) {
          const redirectUrl = xhr.getResponseHeader("Location");
          if (redirectUrl) {
              window.location.href = redirectUrl;
          } else {
              console.error("Redirect URL not found");
          }
      } else {
          console.error("Error fetching session data");
      }
  };
  xhr.send();
  updateFriendNotificationDot();
}

// Function to update the red dot visibility based on pending friend requests
function updateFriendNotificationDot() {
  const notificationDot = document.getElementById("friends-notification");

  if (friendRequests.length > 0) {
    notificationDot.style.display = "inline-block"; // Show dot
  } else {
    notificationDot.style.display = "none"; // Hide dot
  }
}

// Ensure friend requests and notifications are loaded when the page is loaded
window.addEventListener("load", function () {
  loadFriendRequests();
  updateFriendNotificationDot();
});
