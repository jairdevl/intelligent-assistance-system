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

        # Convert base64 image data to file
        face_image_data = face_image_data.split(',')[1]
        face_image = ContentFile(base64.b64decode(face_image_data), name=f'{username}.jpg')

        # Save the user and face image in the database
        user = User(username=username)
        user.save()
        user_image = UserImages.objects.create(user=user, image=face_image)

        return JsonResponse({'status': 'success', 'message': 'User created successfully!'})

    return render(request, 'signup.html')
