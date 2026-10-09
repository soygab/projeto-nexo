from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import login_view, register_view, verify_email_view, resend_view, profile_view

urlpatterns = [
    path('me/', profile_view),
    path('resend-verification/', resend_view),
    path('register/', register_view),
    path('verify-email/', verify_email_view, name='verify-email'),
    path('login/', login_view),
    path('login/refresh/', TokenRefreshView.as_view()),
]
