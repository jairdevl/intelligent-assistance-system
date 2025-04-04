from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserImages(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    number_identification = models.CharField(max_length=15, unique=True)
    face_image = models.ImageField(upload_to='user_faces/')

    def __str__(self):
        return self.user.username
