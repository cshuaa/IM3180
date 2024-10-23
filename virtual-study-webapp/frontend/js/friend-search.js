
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

// Function to fetch friend data from the servlet
function fetchFriendData() {
    fetch(`/IM3180/friend-search?username=${encodeURIComponent(username)}`)
        .then(response => {
            if (!response.ok) {
                // Handle HTTP errors
                return response.json().then(error => {
                    throw new Error(error.message || 'Failed to fetch friend data');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Check the structure of data
            // Populate the friends, friendRequests, and allUsers arrays
            friends = data.friends.map(friend => ({
                id: friend.id,
                name: friend.name,
                avatar: '../images/Ellipse22.png'
            }));

            friendRequests = data.friendRequests.map(request => ({
                id: request.id,
                name: request.name || "Unknown User",  // Handle name if not available
                avatar: '../images/Ellipse22.png'
            }));

            allUsers = data.allUsers.map(user => ({
                id: user.id,
                name: user.name,
                avatar: '../images/Ellipse22.png'
            }));

            // Now load friends and friend requests
            loadFriends();
            loadFriendRequests();
        })
        .catch(error => console.error('Error fetching friend data:', error));
}

// Function to load friends dynamically
function loadFriends() {
    const friendList = document.getElementById('friendList');
    friendList.innerHTML = ''; // Clear the list

    friends.forEach(friend => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${friend.avatar}" alt="${friend.name}">
            <span>${friend.name}</span>
        `;
        friendList.appendChild(li);
    });
}

// Filter function for the friend search input
function filterFriends() {
    const searchInput = document.getElementById('friend-search-input').value.toLowerCase();
    const dropdown = document.getElementById('friend-dropdown');

    dropdown.innerHTML = ''; // Clear existing dropdown content
    dropdown.style.display = 'none'; // Hide dropdown initially

    if (searchInput) {
        // Filter the users based on the search input
        const filteredUsers = allUsers.filter(user =>
            user.name.toLowerCase().includes(searchInput)
        );

        console.log("Filtered Users:", filteredUsers);

        if (filteredUsers.length > 0) {
            dropdown.style.display = 'block'; // Show dropdown when there are matches

            filteredUsers.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'dropdown-item';

                // Check if the user exists in the friends array
                const isFriend = friends.some(friend => friend.id === user.id); // Check if the user is already a friend
                console.log(`User: ${user.name}, isFriend: ${isFriend}`); // Debugging log

                userDiv.innerHTML = `
                    <span>${user.name}</span>
                    ${isFriend 
                        ? '<span class="added-text">Added</span>'  // Show "Added" for friends
                        : `<button class="add-friend-btn" onclick="addFriend(${user.id})">Add</button>`}`; // Show "Add" for non-friends

                dropdown.appendChild(userDiv);
            });
        }
    }
}

// Function to simulate adding a friend request
// TODO: send to Friendreq
function addFriend(friendId) {
    const newFriend = allUsers.find(user => user.id === friendId);
    if (newFriend) {

        const xhr = new XMLHttpRequest();
        const uname = document.querySelector(".username").innerHTML;
        xhr.open("GET", `/IM3180/friend-req?username=${uname}&action=add&friendId=${friendId}`, true);
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
window.addEventListener('load', function() {
    getUserInfo(function () { // Fetch the username from the servlet on page load
        fetchFriendData();  // Fetch the data from the servlet only if username is loaded
    });  
});
