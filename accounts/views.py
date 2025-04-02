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
        username = request.POST['username']
        face_image_data = request.POST['face_image']

        # Get the user by username
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User does not exist!'})
        
        # Convert base64 image data to file
        face_image_data = face_image_data.split(','[1])
        uploaded_image = ContentFile(base64.b64decode(face_image_data), name=f'{username}.jpg')

        # Compare the uploaded face image with the stored face image
        uploaded_face_image = face_recognition.load_image_file(uploaded_image)
        uploaded_face_encoding = face_recognition.face_encodings(uploaded_face_image)

        if uploaded_face_encoding:
            uploaded_face_encoding = uploaded_face_encoding[0]
            user_image = UserImages.objects.get(user=user).first()
            stored_face_image = face_recognition.load_image_file(user_image.face_image.path)
            stored_face_encoding = face_recognition.face_encodings(stored_face_image)[0]

            print(stored_face_image, stored_face_encoding)
            # Compare the faces
            match = face_recognition.compare_faces([stored_face_encoding], uploaded_face_encoding)

            if match[0]:
                return JsonResponse({'status': 'success', 'message': 'Login successful!', redirect: '/signup'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Face does not match!'})
        
        return JsonResponse({'status': 'error', 'message': 'Face not detected in the image!'})

    return render(request, 'signin.html')
                    
