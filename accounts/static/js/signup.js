// Get references to the video, canvas, and buttons
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const CaptureButton = document.getElementById('Capture-button');
const signupForm = document.getElementById('signup-form');
const messageDiv = document.getElementById('message');
let capturedImage = null;

// Access the camera and start the video stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        messageDiv.innerText = 'Camera enabled successfully.';
    })
    .catch(error => {
        console.error('Error accessing camera:', error);
        messageDiv.innerText = 'Camera not accessible. Please check permissions.';
    });


