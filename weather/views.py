import requests
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
import requests
from django.http import JsonResponse

def index(request):
    return render(request, 'weather/index.html',{
        'login_form': AuthenticationForm(),
        'register_form': UserCreationForm(),
    })

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f'Регистрация успешна! Добро пожаловать, {user.username}.')
            login(request, user)
            return redirect('index') 
        else:
            messages.error(request, 'Ошибка при регистрации. Проверьте введённые данные.')
    else:
        form = UserCreationForm()
    
    return render(request, 'weather/index.html', {'register_form': form})


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            messages.success(request, f"Добро пожаловать, {user.username}!")  
            return redirect('index') 
        else:
            messages.error(request, "Неверное имя пользователя или пароль.")  
            return redirect('index')  

    return render(request, 'weather/index.html')  



def get_weather(request):
    if request.method == 'GET':
        city = request.GET.get('city', '')
        api_key = '45f9547cb056a7c417f899ed3b97de30'
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'

        try:
            response = requests.get(url)
            data = response.json()

            if response.status_code == 200:
                weather_data = {
                    'city': data['name'],
                    'temperature': data['main']['temp'],
                    'description': data['weather'][0]['description'],
                    'icon': data['weather'][0]['icon'],
                    'wind_speed': data['wind']['speed'],
                    'cloudiness': data['clouds']['all'],
                }
                return JsonResponse({'success': True, 'data': weather_data})
            else:
                return JsonResponse({'success': False, 'error': data.get('message', 'Error occurred')})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})



def get_weather_weekly(request):
    if request.method == 'GET':
        city = request.GET.get('city', '')
        api_key = '45f9547cb056a7c417f899ed3b97de30'
        url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'

        try:
            response = requests.get(url)
            data = response.json()

            if response.status_code == 200:
                weekly_data = []
                for i in range(0, len(data['list']), 8):
                    forecast = data['list'][i]
                    weekly_data.append({
                        'date': forecast['dt_txt'].split(' ')[0],
                        'temperature': forecast['main']['temp'],
                        'description': forecast['weather'][0]['description'],
                        'icon': forecast['weather'][0]['icon'],
                        'wind_speed': forecast['wind']['speed'],
                        'cloudiness': forecast['clouds']['all'],
                    })

                return JsonResponse({'success': True, 'data': weekly_data})
            else:
                return JsonResponse({'success': False, 'error': data.get('message', 'Error occurred')})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
