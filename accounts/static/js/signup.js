// Get references to the video, canvas, and buttons
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-button');
const signupForm = document.getElementById('signup-form');
const message = document.getElementById('message');
let captureImage = null;

// Access the camera and start the video stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing camera:', error);
        message.textContent = 'Camera not accessible. Please check permissions.';
    });

// Capture image from the video stream
captureButton.addEventListener('click', () => {
    if (!video.srcObject) {
        message.textContent = 'Please enable the camera.';
        return;
    }
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the video frame on the canvas
    captureImage = canvas.toDataURL('image/png'); // Convert the canvas to a data URL
    message.textContent = 'Face captured successfully.';
});

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!captureImage) {
        message.textContent = 'Please capture a face first.';
        return;
    }
    const formData = new FormData(signupForm);
    formData.append('face_image', captureImage);

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        message.textContent = data.message || 'Sign up failed.';
    } catch (error) {
        console.error('Error during sign up:', error);
        message.textContent = 'An error occurred during sign up: ' + error.message;
    }
});