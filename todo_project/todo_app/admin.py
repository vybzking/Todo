from django.contrib import admin
from . import models
from django.contrib.auth.admin import UserAdmin
from .forms import TodoAppUserChangeForm, TodoAppUserCreationForm
from .models import TodoAppUser

@admin.register(TodoAppUser)
class CustomUserAdmin(UserAdmin):
    # Hook up the custom form variations
    form = TodoAppUserChangeForm
    add_form = TodoAppUserCreationForm

    # Control the admin dashboard columns
    list_display = ("email", "first_name", "last_name", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

    # Forms structure for changing a user profile
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    # Forms structure for creating a brand new user
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password", "first_name", "last_name"),
        }),
    )