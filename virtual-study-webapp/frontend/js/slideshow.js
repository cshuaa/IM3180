let slideIndex = 0;
let slideTimer;

// Function to show slides
function showSlides(n) {
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");

  if (n >= slides.length) { slideIndex = 0; }
  if (n < 0) { slideIndex = slides.length - 1; }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex].style.display = "block";
  dots[slideIndex].className += " active";
}

// Function to set current slide based on dot click
function currentSlide(n) {
  slideIndex = n - 1;
  resetSlideTimer();
  showSlides(slideIndex);
}

// Function to automatically advance slides
function autoSlides() {
  slideIndex++;
  showSlides(slideIndex);
}

// Function to reset the timer
function resetSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(autoSlides, 7000); // 7 seconds for each slide
}

// Initialize slideshow
document.addEventListener("DOMContentLoaded", () => {
  showSlides(slideIndex);
  slideTimer = setInterval(autoSlides, 7000);
});