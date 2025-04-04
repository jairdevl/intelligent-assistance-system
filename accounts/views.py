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
        username = request.POST.get('username')
        face_image_data = request.POST.get('face_image')
        number_identification = request.POST.get('number_identification')

        # Check if all required fields are provided
        if not username or not face_image_data or not number_identification:
            return JsonResponse({'status': 'error', 'message': 'All fields are required!'})

        # Check if user already exists
        if UserImages.objects.filter(number_identification=number_identification).exists() or User.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'message': 'User already exists!'})

        # Convert base64 image data to file
        try:
            face_image_data = face_image_data.split(',')[1]
            face_image = ContentFile(base64.b64decode(face_image_data), name=f'{number_identification}.jpg')
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'Invalid face image data!'})

        # Save the user and face image in the database
        user = User(username=username)
        user.save()

        UserImages.objects.create(
            user=user,
            face_image=face_image,
            number_identification=number_identification
        )

        return JsonResponse({'status': 'success', 'message': 'User created successfully!'})

    return render(request, 'signup.html')

@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        face_image_data = request.POST.get('face_image')

        # Check if username and face image are present
        if not username or not face_image_data:
            return JsonResponse({'status': 'error', 'message': 'Username and face image are required!'})

        # Get the user by username
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found!'})

        # Convert base64 image data to file
        try:
            face_image_data = face_image_data.split(',')[1]
            uploaded_image = ContentFile(base64.b64decode(face_image_data), name=f'{username}.jpg')
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'Invalid face image data!'})

        # Load and encode the uploaded image
        uploaded_face_image = face_recognition.load_image_file(uploaded_image)
        uploaded_face_encoding = face_recognition.face_encodings(uploaded_face_image)

        if not uploaded_face_encoding:
            return JsonResponse({'status': 'error', 'message': 'Face not detected!'})

        uploaded_face_encoding = uploaded_face_encoding[0]

        # Get the stored user image
        user_image = UserImages.objects.filter(user=user).first()
        if not user_image:
            return JsonResponse({'status': 'error', 'message': 'User image not found!'})

        stored_face_image = face_recognition.load_image_file(user_image.face_image.path)
        stored_face_encoding = face_recognition.face_encodings(stored_face_image)

        if not stored_face_encoding:
            return JsonResponse({'status': 'error', 'message': 'Stored face encoding not found!'})

        stored_face_encoding = stored_face_encoding[0]

        # Compare the faces
        match = face_recognition.compare_faces([stored_face_encoding], uploaded_face_encoding)
        if match[0]:
            return JsonResponse({'status': 'success', 'message': 'Login successful!'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Face does not match!'})

    return render(request, 'login.html')