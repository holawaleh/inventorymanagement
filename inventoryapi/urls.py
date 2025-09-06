from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from inventory import views as inventory_views
from django.shortcuts import redirect

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('signup/', inventory_views.signup, name='signup'),

    # Dashboard
    path('dashboard/', inventory_views.dashboard, name='dashboard'),

    # API
    path('api/', include('inventory.urls')),

        path("", lambda request: redirect("dashboard"), name="home"),

]