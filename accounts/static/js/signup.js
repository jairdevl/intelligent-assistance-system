// Define global variable
let videoElement;
let canvasElement;
let captureButton;
let signupForm;
let messageElement;
let capturedImage;
let cameraStream;

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Getting references to elements
    videoElement = document.getElementById('video');
    canvasElement = document.getElementById('canvas');
    captureButton = document.getElementById('capture-button');
    signupForm = document.getElementById('signup-form');
    messageElement = document.getElementById('message');

    // Initialize camera
    initializeCamera();

    // Configure button events
    setupButtonEvent();
});

// Initializes the webcam and displays live video
function initializeCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            cameraStream = stream;
            videoElement.srcObject = stream;
            messageElement.textContent = "Camera initialized successfully!"
        })
        .catch(function(error) {
            console.error("Failed to initialize camera:", error);
            messageElement.textContent = "The camera could not be initialized. Please check your permissions. ";
        });
}