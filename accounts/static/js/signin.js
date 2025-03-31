// Get references to the video, canvas, and buttons
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const CaptureButton = document.getElementById('Capture-button');
const signinForm = document.getElementById('signin-form');
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
signinForm.onsubmit = async (e) => {
    e.preventDefault();

    if(!capturedImage) {
        messageDiv.innerText = 'Please capture your face first.'
        return;
    }

    const username = document.getElementById('username').value;
    const data = {
        username: username,
        image: capturedImage
    };

    try {
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(!response.ok) {
            throw new Error('Failed to sign in');
        }

        const result = await response.json();
        if(result.success) {
            messageDiv.innerText = 'Sign in successful.';
            setTimeout(() => {
                window.location.href = '/signup';
            }, 1000);
        } else {
            messageDiv.innerText = 'Sign in failed. Please try again.';
        }
    } catch (error) {
        console.error('Error signing in:', error);
        messageDiv.innerText = 'An error occurred. Please try again.';
    }
};