from django.db import models
from django.core.validators import RegexValidator
import datetime


phone_validator = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)

class Users(models.Model):
    User_profile_photo = models.ImageField(upload_to="UserImages/",default=None)
    UserName = models.CharField(unique=True,max_length=150)
    User_Gender = models.CharField(max_length=13,default=None)
    User_Languages_Know = models.CharField(max_length=300,default=None)
    PassWord = models.CharField(max_length=150)
    Mail_id = models.EmailField(unique=True)
    Location = models.CharField(max_length=150,default=None)
    User_Number = models.CharField(max_length=15,validators=[phone_validator],unique=True,)
    User_fullName = models.CharField(max_length=150,default=None)
    
class Tourist_Guide(models.Model):
    Guide_Image = models.ImageField(upload_to = "GuideImages/",default=None)
    Guide_Username = models.CharField(unique=True,max_length=150)
    Guide_PassWord = models.CharField(max_length=150)
    Guide_Mail_id = models.EmailField(unique=True)
    Guide_FullName = models.CharField(max_length=150)
    Guide_experience = models.IntegerField(default=0)
    Guide_Number = models.CharField(max_length=15,validators=[phone_validator],unique=True,default=None)
    Guide_Gender = models.CharField(max_length=13,default="Male")
    Guide_Languages_know = models.CharField(max_length=300)

class Book_guide(models.Model):
    user = models.ForeignKey(to=Users,on_delete=models.CASCADE)
    G_userName = models.ForeignKey(to=Tourist_Guide,on_delete=models.CASCADE)
    from_date = models.DateField(default=datetime.date.today)
    to_date = models.DateField(default=datetime.date.today)
    status = models.IntegerField(default=0)

class Itinerary(models.Model):
    i_user = models.ForeignKey(to=Users,on_delete=models.CASCADE)
    i_guide = models.ForeignKey(to=Tourist_Guide,on_delete=models.CASCADE)
    day = models.IntegerField(default=1)
    time = models.TimeField()
    trip_details = models.CharField(max_length=200)
    time_status = models.IntegerField(default=0)
    trip_status = models.IntegerField(default=0)
# Create your models here.
