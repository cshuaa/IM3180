function togglePassword() {
    var passwordField = document.getElementById("password-field");
    var eyeIcon = document.getElementById("eye-icon");

    // Toggle password visibility
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "../images/show-password-white.png"; // Change icon to open eye
    } else {
        passwordField.type = "password";
        eyeIcon.src = "../images/password-white.png"; // Change icon to closed eye
    }
}

document.getElementById("privacy-toggle").addEventListener("change", function() {
    var label = document.querySelector(".toggle-label");
    var passwordInput = document.querySelector(".password"); // Update to match the class in your HTML

    if (this.checked) {
        label.textContent = "Private Room"; // Toggle is set to Private
        passwordInput.disabled = false; // Enable input
        passwordInput.style.backgroundColor = "rgba(197, 217, 223, 0.7)"; // Original lighter background
    } else {
        label.textContent = "Public Room"; // Toggle is set to Public
        passwordInput.disabled = true; // Disable input
        passwordInput.style.backgroundColor = "#555"; // Darker background color when disabled
    }
});

