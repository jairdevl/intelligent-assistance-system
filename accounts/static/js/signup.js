// Get references to the video, canvas, and buttons
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-button');
const signupForm = document.getElementById('signup-form');
const messageDiv = document.getElementById('message');
let capturedImage = null;


// Access the camera and start the video stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        messageDiv.textContent = 'Camera access successful.';
        
    })
    .catch((error) => {
        console.error('Error accessing the camera:', error);
        messageDiv.textContent = 'Camera not accessible. Please check your camera permissions.';
    });

// Capture image from the video stream
captureButton.addEventListener('click', () => {
    if (!capturedImage) {
        messageDiv.textContent = 'Please enable the camera and try again.';
        return;
    }
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the video frame on the canvas
    capturedImage = canvas.toDataURL('image/jpeg'); // Convert the canvas to a data URL
    messageDiv.textContent = 'Image captured successfully.';
});

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!capturedImage) {
        messageDiv.textContent = 'Please capture your face first.';
        return;
    }
    const formData = new FormData(signupForm);
    formData.append('face_image', capturedImage);

    const response = await fetch('/signup', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    messageDiv.textContent = data.message || 'Failed to sign up.';
    
});