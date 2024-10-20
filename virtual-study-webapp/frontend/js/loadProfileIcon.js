let profileImagePath = "";
const smallProfilePicture = document.querySelector(".profile-pic");

const xhr = new XMLHttpRequest();
xhr.open("GET", "/IM3180/loadprofile", true); // Replace with the correct path to the servlet
xhr.onload = function () {
  if (xhr.status === 200) {
    // Parse the JSON response
    const profileData = JSON.parse(xhr.responseText);

    // Log the sessionData to check the values (optional)
    console.log(profileData);

    if (
      Object.keys(profileData).length === 0 &&
      profileData.constructor === Object
    ) {
      //Profile data is empty
    } else {
      // Set the global sessionName and sessionKey variables with the retrieved data
      profileImagePath = profileData.imagePath;
      smallProfilePicture.src = profileImagePath;

      // Log the updated sessionName and sessionKey (optional)
      console.log("Updated imagePath: ", profileImagePath);
    }
  } else {
    console.error("Error fetching profile image data");
  }
};

xhr.send();
