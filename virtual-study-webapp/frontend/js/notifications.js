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
        friends.push(friendToAdd);
        friendRequests = friendRequests.filter(request => request.id !== requestId);

        loadFriends();       // Reload the friends list
        loadFriendRequests(); // Reload friend requests
        alert(`You accepted the friend request from ${friendToAdd.name}`);
    }
    updateFriendNotificationDot();
}

// Function to decline a friend request
function declineFriendRequest(requestId) {
    friendRequests = friendRequests.filter(request => request.id !== requestId);
    loadFriendRequests();
    alert('You declined the friend request');
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
