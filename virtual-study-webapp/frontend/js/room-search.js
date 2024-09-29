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
