// Declare globally shared arrays for friends, friend requests, and all users
friends = [
    { id: 1, name: 'user1', avatar: '../images/Ellipse 22.png' },
    { id: 2, name: 'user2', avatar: '../images/Ellipse 22.png' },
    { id: 3, name: 'user3', avatar: '../images/Ellipse 22.png' },
    { id: 9, name: 'user4', avatar: '../images/Ellipse 22.png' },
    { id: 10, name: 'user5', avatar: '../images/Ellipse 22.png' }
];

friendRequests = [
    { id: 4, name: 'queeeniee', avatar: '../images/Ellipse 22.png' },
    { id: 5, name: 'oliviastudy', avatar: '../images/Ellipse 22.png' },
    { id: 6, name: 'stephen22', avatar: '../images/Ellipse 22.png' },
    { id: 7, name: 'charlottexx', avatar: '../images/Ellipse 22.png' },
    { id: 11, name: 'user6', avatar: '../images/Ellipse 22.png' },
    { id: 12, name: 'user9', avatar: '../images/Ellipse 22.png' },
    { id: 13, name: 'user10', avatar: '../images/Ellipse 22.png' }
];

// Full user list including friends and users not in the friends list
allUsers = [
    { id: 1, name: 'user1', avatar: '../images/Ellipse 22.png' },
    { id: 2, name: 'user2', avatar: '../images/Ellipse 22.png' },
    { id: 3, name: 'user3', avatar: '../images/Ellipse 22.png' },
    { id: 4, name: 'queeeniee', avatar: '../images/Ellipse 22.png' },
    { id: 5, name: 'oliviastudy', avatar: '../images/Ellipse 22.png' },
    { id: 6, name: 'stephen22', avatar: '../images/Ellipse 22.png' },
    { id: 7, name: 'charlottexx', avatar: '../images/Ellipse 22.png' },
    { id: 9, name: 'user4', avatar: '../images/Ellipse 22.png' },
    { id: 10, name: 'user5', avatar: '../images/Ellipse 22.png' },
    { id: 11, name: 'user6', avatar: '../images/Ellipse 22.png' },
    { id: 12, name: 'user9', avatar: '../images/Ellipse 22.png' },
    { id: 13, name: 'user10', avatar: '../images/Ellipse 22.png' },
    { id: 14, name: 'newuser1', avatar: '../images/Ellipse 22.png' }, // Non-friend user
    { id: 15, name: 'newuser2', avatar: '../images/Ellipse 22.png' }  // Non-friend user
];

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

        if (filteredUsers.length > 0) {
            dropdown.style.display = 'block'; // Show dropdown when there are matches

            filteredUsers.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'dropdown-item';

                // Check if the user is already in the friends list
                const isFriend = friends.some(friend => friend.id === user.id);

                userDiv.innerHTML = `
                    <span>${user.name}</span>
                    ${isFriend 
                        ? '<span class="added-text">Added</span>'  // Show "Added" for friends
                        : `<button class="add-friend-btn" onclick="addFriend(${user.id})">Add</button>`} <!-- Show "Add" for non-friends -->
                `;

                dropdown.appendChild(userDiv);
            });
        }
    }
}

// Function to simulate adding a friend request
function addFriend(friendId) {
    const newFriend = allUsers.find(user => user.id === friendId);
    if (newFriend) {
        friendRequests.push(newFriend);
        alert(`Friend request sent to ${newFriend.name}`);
        
        loadFriendRequests(); // Reload the friend requests section
        document.getElementById('friend-dropdown').style.display = 'none'; // Hide dropdown
    }
}

// Ensure friend list is loaded when the page is loaded
window.addEventListener('load', function() {
    loadFriends();
});
