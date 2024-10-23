function callback() {
    console.log("Callback function executed successfully.");
}

function getUserName(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/IM3180/userdata", true); // Replace with the correct path to the servlet
  
    xhr.onload = function () {
      if (xhr.status === 200) {
        const userData = JSON.parse(xhr.responseText);
        username = userData.userName;
        document.querySelector(".username").innerHTML = username;
        if (callback) callback();
      } else {
        console.error("Error fetching session data");
      }
    };
  
    xhr.send();
  }

// Function to load friend requests dynamically with Accept and Decline buttons
function loadFriendRequests() {
    const requestList = document.getElementById('requestList');
    requestList.innerHTML = ''; // Clear the list

    friendRequests.forEach(request => {
        const li = document.createElement('li');
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

// Function to accept a friend request
function acceptFriendRequest(requestId) {
    const friendToAdd = friendRequests.find(request => request.id === requestId);
    if (friendToAdd) {
        // friends.push(friendToAdd);
        // friendRequests = friendRequests.filter(request => request.id !== requestId);

         

        const xhr = new XMLHttpRequest();
        const uname = document.querySelector(".username").innerHTML;
        xhr.open("GET", `/IM3180/friend-req?username=${uname}&action=accept&friendId=${requestId}`, true);
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

        //loadFriends();       // Reload the friends list
        //loadFriendRequests(); // Reload friend requests
    
    }
    updateFriendNotificationDot();
}

// Function to decline a friend request
function declineFriendRequest(requestId) {
    friendRequests = friendRequests.filter(request => request.id !== requestId);
    //loadFriendRequests();
    //alert('You declined the friend request');

    const xhr = new XMLHttpRequest();
    const uname = document.querySelector(".username").innerHTML;
    xhr.open("GET", `/IM3180/friend-req?username=${uname}&action=decline&friendId=${requestId}`, true);
    console.log(uname);
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
    const notificationDot = document.getElementById('friends-notification');
    
    if (friendRequests.length > 0) {
        notificationDot.style.display = 'inline-block'; // Show dot
    } else {
        notificationDot.style.display = 'none'; // Hide dot
    }
}

// Ensure friend requests and notifications are loaded when the page is loaded
window.addEventListener('load', function() {
    loadFriendRequests();
    updateFriendNotificationDot();
});
