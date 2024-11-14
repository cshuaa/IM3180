import uitoolkit from "./videosdk-ui-toolkit/index.js";

// Define variables for sessionName and sessionKey at the top but leave them empty
let sessionName = "";
let sessionKey = "";
let userName = "";
let userId = "";
const sessionContainer = document.getElementById("sessionContainer");

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
  xhr.open("GET", "/IM3180/roomdata", true); // Replace with the correct path to the servlet

  // xhr.setRequestHeader("Cross-Origin-Opener-Policy", "same-origin");
  // xhr.setRequestHeader("Cross-Origin-Embedder-Policy", "require-corp");
  // xhr.setRequestHeader("Permissions-Policy", "compute-pressure=(self)");

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
      userId = sessionData.userId;

      // Log the updated sessionName and sessionKey (optional)
      console.log("Updated sessionName: ", sessionName);
      console.log("Updated sessionPassword (sessionKey): ", sessionKey);
      console.log("Updated userName: ", userName);
      console.log("Updated userId: ", userId);

      // Now that sessionName and sessionKey are updated, you can generate the signature
      const signature = generateSignature(
        "", //Replace with Video SDK Key
        "", //Replace with Video SDK Secret
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
      // document
      //   .getElementById("startCallBtn")
      //   .addEventListener("click", function () {
      startCall(config);
      // });
    } else {
      console.error("Error fetching session data");
    }
  };

  xhr.send();
}

function startCall(config) {
  uitoolkit.joinSession(sessionContainer, config);
  uitoolkit.onSessionJoined(sessionJoined);
  uitoolkit.onSessionClosed(sessionClosed);
}

var sessionJoined = () => {
  console.log("session joined");
};

var sessionClosed = () => {
  console.log("session closed");
  uitoolkit.closeSession(sessionContainer);

  // Call Servlet to delete session from active sessions
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/IM3180/closeroom", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    if (xhr.status === 200) {
      // Redirect to HTML Page 2
      window.location.href = "main-home.html";
    } else {
      console.error("Error sending data to the servlet");
    }
  };

  // Send session data to the servlet
  xhr.send(
    `sessionName=${encodeURIComponent(sessionName)}
    &userId=${encodeURIComponent(userId)}`
  );
};
