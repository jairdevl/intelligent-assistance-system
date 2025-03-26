from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class User(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    face_image = models.ImageField(upload_to='user_faces/')

    def __str__(self):
        return self.user.username
    