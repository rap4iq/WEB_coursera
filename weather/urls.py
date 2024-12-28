from django.urls import path
from .views import index, get_weather, get_weather_weekly, register
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', index, name='index'),  
    path('get_weather/', get_weather, name='get_weather'),  
    path('get_weather_weekly/', get_weather_weekly, name='get_weather_weekly'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/',register, name='register'),
]
