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

// Configure event elements iteratively
function setupButtonListener() {
    // Event listener for capture button
    captureButton.addEventListener('click', captureButton);
    // Event listener for signup form
    signupForm.addEventListener('submit', signupForm);
}

// Capture image from video stream
function captureImage() {
    // Check if camera is active
    if (!videoElement.srcObject) {
        messageElement.textContent = "Camera is not active. Please initialize the camera first.";
        return;
    }

    // Get the context of the canvas
    const context = canvasElement.getContext('2d');
    // Draw the video frame on the canvas
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    // Capture the image
    capturedImage = canvasElement.toDataURL('image/png');
    messageElement.textContent = "Image captured successfully!";
    canvasElement.style.display = 'block';
}



}
