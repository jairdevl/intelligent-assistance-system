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
