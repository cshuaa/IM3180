var publicRooms = [];
var privateRooms = [];

// Fetch room data from the servlet
function fetchRoomData() {
    fetch("/IM3180/MainServlet")
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Failed to fetch room data');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Debugging: Check the structure of the data

            // Populate publicRooms and privateRooms arrays
            publicRooms = data.publicRooms.map(room => ({
                id: room.id,
                room_name: room.room_name,
                username: room.username
            }));

            privateRooms = data.privateRooms.map(room => ({
                id: room.id,
                room_name: room.room_name,
                username: room.username
            }));

            // Now load public and private rooms dynamically
            loadPublicRooms();
            loadPrivateRooms();
        })
        .catch(error => console.error('Error fetching room data:', error));
}

// Function to dynamically load public rooms (filtered or unfiltered)
function loadPublicRooms(rooms = publicRooms) {
    const publicRoomContainer = document.querySelector('.public-rooms');
    
    // Only clear dynamically generated rooms, keep the header
    publicRoomContainer.querySelectorAll('.room').forEach(room => room.remove());

    rooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.classList.add('room');

        roomElement.innerHTML = `
            <div class="room-info">
                <span class="room-name">${room.room_name}</span>
                <span class="room-creator"><span class="dot"></span>created by ${room.username}</span>
            </div>
            <button class="joinCall-btn" onclick="location.href='main-join.html?id=${room.id}';">Join</button>
        `;

        publicRoomContainer.appendChild(roomElement);
    });
}

// Function to dynamically load private rooms (filtered or unfiltered)
function loadPrivateRooms(rooms = privateRooms) {
    const privateRoomContainer = document.querySelector('.private-rooms');

    // Only clear dynamically generated rooms, keep the header
    privateRoomContainer.querySelectorAll('.room').forEach(room => room.remove());

    rooms.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.classList.add('room');

        roomElement.innerHTML = `
            <div class="room-info">
                <span class="room-name">${room.room_name}</span>
                <span class="room-creator"><span class="dot"></span>created by ${room.username}</span>
            </div>
            <button class="joinCall-btn" onclick="location.href='main-join.html?id=${room.id}';">Join</button>
        `;

        privateRoomContainer.appendChild(roomElement);
    });
}


function filterFunction() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    // Filter public and private rooms based on room_name
    const publicRoomsFiltered = publicRooms.filter(room => room.room_name.toLowerCase().includes(searchInput));
    const privateRoomsFiltered = privateRooms.filter(room => room.room_name.toLowerCase().includes(searchInput));
    
    // Clear and repopulate rooms based on search input
    loadPublicRooms(publicRoomsFiltered);
    loadPrivateRooms(privateRoomsFiltered);
}

// Ensure the room data is loaded when the page is loaded
window.addEventListener('load', function() {
    fetchRoomData();  // Fetch the room data from the servlet when the page loads
});
