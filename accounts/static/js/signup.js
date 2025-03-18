// Get elements from the DOMconst video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-button');
const message = document.getElementById('message');
const signupForm = document.getElementById('signup-form');

// Request access to the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing the camera:', error);
        message.textContent = 'Error accessing the camera';
    });