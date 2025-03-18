from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Users(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    identification_number = models.CharField(max_length=55)
    face_image = models.ImageField(upload_to='user_faces/')

    def __str__(self):
        return f"{self.user.username} - {self.identification_number}"