"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from pathlib import Path

from django.contrib import admin
from django.http import FileResponse
from django.urls import include, path, re_path
from django.views.static import serve


FRONTEND_ROOT = Path(__file__).resolve().parents[2]


def frontend(request):
    """Serve the application's entry point from the project root."""
    response = FileResponse(FRONTEND_ROOT.joinpath('index.html').open('rb'))
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate'
    return response


def frontend_asset(request, path, directory):
    """Serve development assets without leaving stale UI files in the browser."""
    response = serve(request, path, document_root=FRONTEND_ROOT / directory)
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate'
    return response

urlpatterns = [
    path('', frontend, name='frontend'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    # The front-end is intentionally kept outside Django's static/ directory.
    # These routes make it available when the project is run with runserver.
    re_path(r'^public/(?P<path>.*)$', frontend_asset, {'directory': 'public'}),
    re_path(r'^src/(?P<path>.*)$', frontend_asset, {'directory': 'src'}),
]
