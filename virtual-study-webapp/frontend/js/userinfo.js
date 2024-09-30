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
