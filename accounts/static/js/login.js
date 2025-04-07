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
    // Detect mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    const context = canvas.getContext('2d');
    if (isMobile) {
        // For mobile devices, adjust for better face detection
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const scale = Math.min(canvas.width / videoWidth, canvas.height / videoHeight);
        
        // Center the image in the canvas
        const xOffset = (canvas.width - videoWidth * scale) / 2;
        const yOffset = (canvas.height - videoHeight * scale) / 2;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
            video, 
            0, 0, videoWidth, videoHeight, 
            xOffset, yOffset, videoWidth * scale, videoHeight * scale
        );
    } else {
        // For desktop, use standard method
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    
    capturedImage = canvas.toDataURL('image/jpeg', 0.9); // Higher quality for better detection
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