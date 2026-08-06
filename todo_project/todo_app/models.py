from django.db import models
import auth
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class TodoAppUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("The email field is required")
        email = self.normalize_email(email)
	user = self.model(email=email, **extra)
	user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, **extra):
        extra.set_default("is_staff", True)
        extra.set_default("is_active", True)
        extra.set_default("is_superuser", True)

        if extra.get("is_staff") is not True:
            raise ValueError("Superuser must be a staff.")
        if extra.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra)
        

class TodoAppUser(AbstractBaseUser):
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = TodoAppUserManager()

    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email

class Task(models.Model):
    # assigned_to = models.ForeignKey(TodoAppUser, on_delete=models.CASCADE, null= True, blank=True, reversed_name="task_to")
    title = model.CharField(max_length=150)
    description = models.CharField(max_length=250)
    created_by = models.ForeignKey(TodoAppUser, on_delete=models.CASCADE, reversed_name="task")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class TaskAssignment(models.Model):
    STATUS = (("completed", "assigned"))
    assigned_by = models.ForeignKey(TodoAppUser, on_delete=models.CASCADE, null= True, blank=True, reversed_name="task_by")
    assigned_to = models.ForeignKey(TodoAppUser, on_delete=models.CASCADE, null= True, blank=True, reversed_name="task_to")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, null= True, blank=True, reversed_name="assignment")
    assigned_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=9, choices=STATUS)

    def __str__(self):
        return self.task.title