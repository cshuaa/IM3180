// Wrap the entire script in an IIFE to isolate variables and avoid redeclaration conflicts
(function () {
    // Local variables to avoid global scope pollution
    let username = ""; // You may retrieve this via a session if needed
  
    // Function to fetch user information and load friend requests count
    function loadNotificationDot() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "../../../userdata", true);
  
      xhr.onload = function () {
        if (xhr.status === 200) {
          const userData = JSON.parse(xhr.responseText);
          username = userData.userName;
  
          // Now fetch friend data once username is available
          fetchFriendData(username);
        } else {
          console.error("Error fetching user data. Status code:", xhr.status);
        }
      };
  
      xhr.onerror = function () {
        console.error("Request failed");
      };
  
      xhr.send();
    }
  
    // Fetches friend data and updates localStorage with the number of pending requests
    function fetchFriendData(username) {
      fetch(`/IM3180/friend-search?username=${encodeURIComponent(username)}`)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message || "Failed to fetch friend data");
            });
          }
          return response.json();
        })
        .then((data) => {
          const friendRequests = data.friendRequests || [];
          localStorage.setItem("pendingFriendRequestsCount", friendRequests.length);
  
          // Immediately update the red dot visibility based on the new count
          updateFriendNotificationDot();
        })
        .catch((error) => console.error("Error fetching friend data:", error));
    }
  
    // Function to update the red notification dot based on localStorage
    function updateFriendNotificationDot() {
      const notificationDot = document.getElementById("friends-notification");
  
      const pendingRequests = localStorage.getItem("pendingFriendRequestsCount");
      if (notificationDot && pendingRequests && parseInt(pendingRequests) > 0) {
        notificationDot.style.display = "inline-block";
      } else if (notificationDot) {
        notificationDot.style.display = "none";
      }
    }
  
    // Run the loadNotificationDot function on every page load
    document.addEventListener("DOMContentLoaded", loadNotificationDot);
  })();
  