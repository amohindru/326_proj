// Define an array of image URLs
const images = [
    "pictures/antara-pic.jpg",
    "pictures/aaryan-pic.jpg",
    "pictures/arvind-pic.jpg",
    "pictures/devina-pic.jpg"
];

// Initialize current image index
let currentIndex = 0;

// Get references to DOM elements
const galleryImage = document.getElementById("gallery-image");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

// Function to display current image
function displayImage() {
    galleryImage.src = images[currentIndex];
}

// Function to handle "Next" button click
nextButton.addEventListener("click", function() {
    currentIndex = (currentIndex + 1) % images.length;
    displayImage();
});

// Function to handle "Previous" button click
prevButton.addEventListener("click", function() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    displayImage();
});

// Display initial image
displayImage();