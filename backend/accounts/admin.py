from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'instituicao', 'curso', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Dados acadêmicos', {'fields': ('instituicao', 'curso')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Dados acadêmicos', {'fields': ('instituicao', 'curso')}),
    )

admin.site.register(User, CustomUserAdmin)