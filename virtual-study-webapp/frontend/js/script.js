//includes code for the search room dropdown, the show/hide password toggle and the private/public room toggle

function filterFunction() {
    var input, filter, dropdown, items, i;
    input = document.getElementById("search-input");
    filter = input.value.toUpperCase();
    dropdown = document.getElementById("dropdown");
    items = dropdown.getElementsByClassName("dropdown-item"); // Use the correct class name

    // Show the dropdown when typing
    dropdown.style.display = input.value ? "block" : "none";

    // Loop through all dropdown items and hide those that don't match the search query
    for (i = 0; i < items.length; i++) {
        var text = items[i].getElementsByTagName("span")[0].innerHTML; // Get the text from the span
        if (text.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = ""; // Show matching items
        } else {
            items[i].style.display = "none"; // Hide non-matching items
        }
    }
}


function togglePassword() {
    var passwordField = document.getElementById("password-field");
    var eyeIcon = document.getElementById("eye-icon");

    // Toggle password visibility
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.src = "images/password-white.png"; // Change icon to open eye
    } else {
        passwordField.type = "password";
        eyeIcon.src = "images/show-password-white.png"; // Change icon to closed eye
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

