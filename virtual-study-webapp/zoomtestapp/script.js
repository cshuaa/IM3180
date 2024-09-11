import uitoolkit from "./videosdk-ui-toolkit/index.js";

var sessionName = "sessionName";
var sessionKey = "sessionKey";
var userName = "userName";

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

var signature = generateSignature(
  "kC1ECojrY3byf9i2lxjUyYgTs84A4F1zjQKF",
  "wCFI4yiMMlLo2qEykh8uS8MK2GcqZVCsQIOx",
  sessionName,
  1,
  sessionKey,
  userName
);

console.log(signature);

var config = {
  videoSDKJWT: signature,
  sessionName: sessionName,
  userName: userName,
  sessionPasscode: sessionKey,
  features: ["preview", "video", "audio", "share", "chat", "users", "settings"],
  options: {
    init: {},
    audio: {},
    video: { enforceMultipleVideos: true },
    share: {},
  },
  virtualBackground: {
    allowVirtualBackground: true,
    allowVirtualBackgroundUpload: true,
    //virtualBackgrounds: ['https://images.example.com/image', 'http://example.com/assets/backgrounds/sample.png']
  },
};

function startCall() {
  const sessionContainer = document.getElementById("sessionContainer");
  uitoolkit.joinSession(sessionContainer, config);
}

// Bind the function to the button click event
document.getElementById("startCallBtn").addEventListener("click", startCall);
