from django.db import models

from django.contrib.auth.models import User

from django.conf import settings # Here

from django.contrib import admin

# Create your models here.

# staff_user = User.objects.filter(is_staff=True)

CHOICES = (
    ("Submitted", "Submitted"),
    ("Processing", "Processing"),
    ("Completed", "Completed"),
)

class ticket_Orders(models.Model):
    user_name = models.CharField(max_length=300,blank=True,null=True)
    user_id = models.CharField(max_length=300,blank=True,null=True)
    fname = models.CharField(max_length=300,blank=True,null=True)
    lname = models.CharField(max_length=300,blank=True,null=True) 
    email = models.CharField(max_length=300,blank=True,null=True)
    Phone_Number = models.CharField(max_length=300,blank=True,null=True)
    Product_Name = models.CharField(max_length=300,blank=True,null=True)
    comment = models.CharField(max_length=300,blank=True,null=True)
    answer = models.CharField(max_length=3000,blank=True,null=True) 
    Address= models.CharField(max_length=300,blank=True,null=True)
    status= models.CharField(max_length=300,choices = CHOICES,blank=True,null=True,default="Submitted") 
    date = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    engg_username =  models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,default=1) 


    
    def __str__(self):
        return self.fname+ " - " + self.lname +" - "+self.Product_Name 



# class ticket_Orders_admin(admin.ModelAdmin):
    
#     search_fields = ['user_name', 'user_id','fname','lname','email','Phone_Number','Product_Name','comment','answer','Address','date',]
