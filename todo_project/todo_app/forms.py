from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import TodoAppUser


class CustomUserCreationForm(UserCreationForm):
    """Form used to create new custom users in the frontend or admin panel."""

    class Meta(UserCreationForm.Meta):
        model = TodoAppUser
        # Explicitly define fields, ensuring 'username' is removed
        fields = ("email", "first_name", "last_name")


class CustomUserChangeForm(UserChangeForm):
    """Form used to update existing custom users in the admin panel."""

    class Meta(UserChangeForm.Meta):
        model = CustomUser
        fields = ("email", "first_name", "last_name", "is_active", "is_staff")
