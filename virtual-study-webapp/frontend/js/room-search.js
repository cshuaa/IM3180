var publicRooms = [];
var privateRooms = [];
let userName = "";
let userId = "";

window.onload = getUserInfo;

function getUserInfo() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../../../userdata", true); // Replace with the correct path to the servlet

  xhr.onload = function () {
    if (xhr.status === 200) {
      // Parse the JSON response
      const userData = JSON.parse(xhr.responseText);

      // Log the userData to check the values (optional)
      console.log(userData);

      // Set the global sessionName and sessionKey variables with the retrieved data
      userName = userData.userName;
      userId = userData.userId;

      // Optionally display the sessionName and sessionPassword on the HTML page
      // document.getElementById("userName").textContent = userName;
      //   document.getElementById("userId").textContent = userId;
      // Select the anchor element by class
      const userNameDisplay = document.querySelector("a.username");
      userNameDisplay.innerHTML = userNameDisplay.innerHTML.replace(
        "Username",
        userName
      );

      // Log the updated sessionName and sessionKey (optional)
      console.log("Retrieved userName: ", userName);
      console.log("Retrieved userId: ", userId);
    } else {
      console.error("Error fetching session data");
    }
  };

  xhr.send();
}
// Fetch room data from the servlet
function fetchRoomData() {
  fetch("/IM3180/MainServlet")
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || "Failed to fetch room data");
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // Debugging: Check the structure of the data

      // Populate publicRooms and privateRooms arrays
      publicRooms = data.publicRooms.map((room) => ({
        id: room.id,
        room_name: room.room_name,
        username: room.username,
      }));

      privateRooms = data.privateRooms.map((room) => ({
        id: room.id,
        room_name: room.room_name,
        username: room.username,
      }));

      // Now load public and private rooms dynamically
      loadPublicRooms();
      loadPrivateRooms();
    })
    .catch((error) => console.error("Error fetching room data:", error));
}

// Function to dynamically load public rooms (filtered or unfiltered)
function loadPublicRooms(rooms = publicRooms) {
  const publicRoomContainer = document.querySelector(".public-rooms");

  // Only clear dynamically generated rooms, keep the header
  publicRoomContainer
    .querySelectorAll(".room")
    .forEach((room) => room.remove());

  rooms.forEach((room) => {
    const roomElement = document.createElement("div");
    roomElement.classList.add("room");

    roomElement.innerHTML = `
            <div class="room-info">
                <span class="room-name">${room.room_name}</span>
                <span class="room-creator"><span class="dot"></span>created by ${room.username}</span>
            </div>
            <button class="joinCall-btn" onclick="sendRoomData('${room.room_name}')">Join</button>
        `;

    publicRoomContainer.appendChild(roomElement);
  });
}

// Function to dynamically load private rooms (filtered or unfiltered)
function loadPrivateRooms(rooms = privateRooms) {
  const privateRoomContainer = document.querySelector(".private-rooms");

  // Only clear dynamically generated rooms, keep the header
  privateRoomContainer
    .querySelectorAll(".room")
    .forEach((room) => room.remove());

  rooms.forEach((room) => {
    const roomElement = document.createElement("div");
    roomElement.classList.add("room");

    roomElement.innerHTML = `
            <div class="room-info">
                <span class="room-name">${room.room_name}</span>
                <span class="room-creator"><span class="dot"></span>created by ${room.username}</span>
            </div>
            <button class="joinCall-btn" onclick="location.href='main-join.html?roomname=${room.room_name}';">Join</button>
        `;

    privateRoomContainer.appendChild(roomElement);
  });
}

function filterFunction() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();

  // Filter public and private rooms based on room_name
  const publicRoomsFiltered = publicRooms.filter((room) =>
    room.room_name.toLowerCase().includes(searchInput)
  );
  const privateRoomsFiltered = privateRooms.filter((room) =>
    room.room_name.toLowerCase().includes(searchInput)
  );

  // Clear and repopulate rooms based on search input
  loadPublicRooms(publicRoomsFiltered);
  loadPrivateRooms(privateRoomsFiltered);
}

// Ensure the room data is loaded when the page is loaded
window.addEventListener("load", function () {
  fetchRoomData(); // Fetch the room data from the servlet when the page loads
});

function sendRoomData(sessionName) {
  // Join public room
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/IM3180/createpublicroom", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      window.location.href = "video-room.html";
    } else {
      console.error("Error sending data to the servlet");
    }
  };

  // Send session data to the servlet
  xhr.send(
    `sessionName=${encodeURIComponent(
      sessionName
    )}&userName=${encodeURIComponent(userName)}&userId=${encodeURIComponent(
      userId
    )}`
  );
}
