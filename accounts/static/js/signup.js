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

// Capture image from the video stream
CaptureButton.addEventListener('click', () => {
    if(!video.srcObject) {
        messageDiv.innerText = 'Please enable the camera.';
        return;
    }
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame to canvas
    capturedImage = canvas.toDataURL('image/jpeg'); // Convert captured image to data URL
    messageDiv.innerText = 'Image captured successfully.';
});

//Handle form submission
signupForm.onsubmit = async (e) => {
    e.preventDefault();

    if(!capturedImage) {
        messageDiv.innerText = 'Please capture your face first.'
        return;
    }

    const formData = new FormData(signupForm);
    formData.append('face_image', capturedImage);

    const response = await fetch('/', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    messageDiv.innerText = data.message || 'Registration failed.';
}
