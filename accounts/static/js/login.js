// Get references to the video, canvas and buttons
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const CaptureButton = document.getElementById('Capture-button');
const loginForm = document.getElementById('login-form');
const message = document.getElementById('message');
let capturedImage = null;

// Access the camera and start the video stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        message.innerText = "Camera enabled successfully.";
    })
    .catch((err) => {
        console.error('Error accessing camera:', err);
        message.innerText = 'Camera not accessible. Please check permissions.';
    });

// Capture image from the video stream
CaptureButton.addEventListener('click', () => {
    if (!video.srcObject) {
        message.innerText = "Camera is not available.";
        return;
    }

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame to canvas
    capturedImage = canvas.toDataURL('image/jpeg'); // Convert captured image to data URL
    message.innerText = 'Image captured successfully. Ready to login.';
});

// Handle form submission
loginForm.onsubmit = async (e) => {
    e.preventDefault();

    if (!capturedImage) {
        message.innerText = 'Please capture your face first.'
        return;
    }

    const formData = new FormData();
    formData.append("username", document.getElementById("username").value);
    formData.append("face_image", capturedImage);

    try {
        const response = await fetch('/login/', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.status === 'success') {
            message.innerText = data.message || 'Login successful!';
            if(data.redirect) {
                window.location.href = data.redirect;
            }
        } else {
            message.innerText = data.message || 'Login Failed.';
        }
    } catch (error) {
        console.error('Error logging in:', error);
        message.innerText = 'An error occurred while processing your login.';
    }
}