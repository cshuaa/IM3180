import uitoolkit from "./videosdk-ui-toolkit/index.js";

// Define variables for sessionName and sessionKey at the top but leave them empty
let sessionName = "";
let sessionKey = "";
let userName = "";

// This function generates the signature (it uses sessionName and sessionKey)
function generateSignature(
  sdkKey,
  sdkSecret,
  sessionName,
  role,
  sessionKey,
  userIdentity
) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    app_key: sdkKey,
    tpc: sessionName,
    role_type: role,
    session_key: sessionKey,
    user_identity: userIdentity,
    version: 1,
    iat: iat,
    exp: exp,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const sdkJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
  return sdkJWT;
}

// Fetch session data from the servlet when the page loads
window.onload = fetchSessionData;

function fetchSessionData() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "roomdata", true); // Replace with the correct path to the servlet

  xhr.onload = function () {
    if (xhr.status === 200) {
      // Parse the JSON response
      const sessionData = JSON.parse(xhr.responseText);

      // Log the sessionData to check the values (optional)
      console.log(sessionData);

      // Set the global sessionName and sessionKey variables with the retrieved data
      sessionName = sessionData.sessionName;
      sessionKey = sessionData.sessionPassword;
      userName = sessionData.userName;

      // Optionally display the sessionName and sessionPassword on the HTML page
      document.getElementById("sessionName").textContent = sessionName;
      document.getElementById("sessionPassword").textContent = sessionKey;
      document.getElementById("userName").textContent = userName;

      // Log the updated sessionName and sessionKey (optional)
      console.log("Updated sessionName: ", sessionName);
      console.log("Updated sessionPassword (sessionKey): ", sessionKey);
      console.log("Updated userName: ", userName);

      // Now that sessionName and sessionKey are updated, you can generate the signature
      const signature = generateSignature(
        "kC1ECojrY3byf9i2lxjUyYgTs84A4F1zjQKF",
        "wCFI4yiMMlLo2qEykh8uS8MK2GcqZVCsQIOx",
        sessionName,
        1, // Assuming role 1 is constant
        sessionKey,
        userName
      );

      console.log("Generated signature: ", signature);

      // Now you can use the updated sessionName and sessionKey in your config object
      var config = {
        videoSDKJWT: signature,
        sessionName: sessionName,
        userName: userName,
        sessionPasscode: sessionKey,
        features: [
          "preview",
          "video",
          "audio",
          "share",
          "chat",
          "users",
          "settings",
        ],
        options: {
          init: {},
          audio: {},
          video: { enforceMultipleVideos: true },
          share: {},
        },
        virtualBackground: {
          allowVirtualBackground: true,
          allowVirtualBackgroundUpload: true,
        },
      };

      // Bind the session data to the call initiation function
      document
        .getElementById("startCallBtn")
        .addEventListener("click", function () {
          startCall(config);
        });
    } else {
      console.error("Error fetching session data");
    }
  };

  xhr.send();
}

function startCall(config) {
  const sessionContainer = document.getElementById("sessionContainer");
  uitoolkit.joinSession(sessionContainer, config);
}
