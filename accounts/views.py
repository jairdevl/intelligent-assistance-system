from math import exp
import face_recognition
import base64
from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.base import ContentFile
from .models import UserImages, User
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        face_image_data = request.POST['face_image']
        number_identification = request.POST['number_identification']

        # Check if user already exists
        if UserImages.objects.filter(number_identification=number_identification).exists() or User.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'message': 'User already exists!'})

        # Convert base64 image data to file
        face_image_data = face_image_data.split(',')[1]
        face_image = ContentFile(base64.b64decode(face_image_data), name=f'{number_identification}.jpg')

        # Save the user and face image in the database
        user = User(username=username)
        user.save()
        UserImages.objects.create(
            user=user, 
            image=face_image,
            number_identification=number_identification
        )

        return JsonResponse({'status': 'success', 'message': 'User created successfully!'})

    return render(request, 'signup.html')

def signin(request):
    if request.method == 'POST':
        face_image_data = request.POST['face_image']
        
        if not face_image_data:
            return JsonResponse({'status': 'error', 'message': 'Face image is required!'})
        
        # Convert base64 image data to file
        face_image_data = face_image_data.split(',')[1]
        face_image = ContentFile(base64.b64decode(face_image_data), name='login.jpg')

        # Process the uploaded image for face recognition 
        try:
            uploaded_image_file = face_recognition.load_image_file(face_image)
            uploaded_face_encodings = face_recognition.face_encodings(uploaded_image_file)
            
            if not uploaded_face_encodings:
                return JsonResponse({'status': 'error', 'message': 'No face detected in the uploaded image!'})

            uploaded_face_encoding = uploaded_face_encodings[0]

            # Get all user images from the database
            all_user_images = UserImages.objects.all()

            # Loop through all registered users to find a match
            for user_image in all_user_images:
                stored_face_image = face_recognition.load_image_file(user.face_image.path)
                stored_face_encodings = face_recognition.face_encodings(stored_face_image)

                if not stored_face_encodings:
                    continue

                stored_face_encoding = stored_face_encodings[0]

                # Compare faces - with a thireshold (0.5 instead of 0.6)
                # Lower values make matching more strict, reducing false positives
                match = face_recognition.compare_faces([stored_face_encoding], uploaded_face_encoding, tolerance=0.5 )
                
                if match[0]:
                    # Calculate the face distance to determine confidence level
                    face_distance = face_recognition.face_distance([stored_face_encoding], uploaded_face_encoding)[0]
                    confidence = 1 - face_distance # Convert distance to confidence score (0-1)

                    # Set a minimum confidences thereshold
                    if confidence < 0.6: # 60% confidence minimum
                        continue

                    # If we have a high-confidence match, log in the user
                    user = user_image.user
                    login(request, user)
                    return JsonResponse({
                        "status": "success", 
                        "message": "Login successful!",
                        "redirect": "/admon/",
                        "username": user.username,
                        "confidence": round(confidence * 100)
                    })

            # If no match found after checking all user
            return JsonResponse({"status": "error", "message": "Face not recognized. Please try again or register."})

        except Exception as e:
            return JsonResponse({"status": "error", "message": f"Authentication error: {str(e)}"})
    return render(request, "signin.html")
                    
