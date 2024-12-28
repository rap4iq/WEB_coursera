document.getElementById('city').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const city = document.getElementById('city').value;

        if (city) {
            document.getElementById('weatherResult').style.display = 'none';
            document.getElementById('weatherWeeklyResult').style.display = 'none';
            document.getElementById('forecastTitle').style.display = 'none';
            document.getElementById('weather-map').style.display = 'block';

            getWeather(city);
            getWeatherWeekly(city);

            getCityCoordinates(city);
        } else {
            alert("Please enter a city name!");
        }
    }
});

function getCityCoordinates(city) {
    const apiKey = '45f9547cb056a7c417f899ed3b97de30'; 
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const { lat, lon } = data[0]; 
                map.setView([lat, lon], 10);
            } else {
                alert("City not found. Please check the name and try again.");
            }
        })
        .catch(error => alert("An error occurred while fetching city coordinates: " + error));
}


function getWeather(city) {
    fetch(`/get_weather/?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('weatherResult').style.display = 'flex';
                document.getElementById('cityName').textContent = data.data.city;
                document.getElementById('temperature').textContent = data.data.temperature;
                document.getElementById('description').textContent = data.data.description;
                document.getElementById('windSpeed').textContent = data.data.wind_speed;
                document.getElementById('cloudiness').textContent = data.data.cloudiness;
                document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${data.data.icon}.png`;
            } else {
                alert(data.error || "Error occurred while fetching weather data.");
            }
        })
        .catch(error => alert("An error occurred: " + error));
}

function getWeatherWeekly(city) {
    fetch(`/get_weather_weekly/?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('forecastTitle').style.display = 'block';
                document.getElementById('weatherWeeklyResult').style.display = 'flex';
                document.getElementById('weatherWeeklyResult').innerHTML = '';

                data.data.forEach(forecast => {
                    const forecastElement = document.createElement('div');
                    forecastElement.classList.add('forecast-item');
                    forecastElement.innerHTML = `
                        <h3>${forecast.date}</h3>
                        <p><strong>Temperature:</strong> ${forecast.temperature} °C</p>
                        <p><strong>Description:</strong> ${forecast.description}</p>
                        <p><strong>Wind Speed:</strong> ${forecast.wind_speed} m/s</p>
                        <p><strong>Cloudiness:</strong> ${forecast.cloudiness}%</p>
                        <img src="http://openweathermap.org/img/wn/${forecast.icon}.png" alt="Weather Icon">
                    `;
                    document.getElementById('weatherWeeklyResult').appendChild(forecastElement);
                });
            } else {
                alert(data.error || "Error occurred while fetching weekly weather data.");
            }
        })
        .catch(error => alert("An error occurred: " + error));
}

var map = L.map('weather-map').setView([55.7558, 37.6173], 10); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

L.tileLayer('https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=45f9547cb056a7c417f899ed3b97de30', {
    attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a>',
    maxZoom: 19
}).addTo(map);


let currentSlide = 0;

function updateSlider() {
    const slider = document.getElementById('weatherWeeklyResult');
    const slides = slider.children;
    const slideWidth = slides[0].clientWidth; 
    slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

function nextSlide() {
    const slider = document.getElementById('weatherWeeklyResult');
    const slides = slider.children;
    if (currentSlide < slides.length - 1) {
        currentSlide++;
    } else {
        currentSlide = 0; 
    }
    updateSlider();
}

function prevSlide() {
    const slider = document.getElementById('weatherWeeklyResult');
    const slides = slider.children;
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        currentSlide = slides.length - 1; 
    }
    updateSlider();
}

document.getElementById('nextButton').addEventListener('click', nextSlide);
document.getElementById('prevButton').addEventListener('click', prevSlide);

setInterval(nextSlide, 5000);




document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault(); 
      document.querySelector('.language-btn').textContent = this.textContent;
    });
});
  

document.getElementById('loginButton').addEventListener('click', () => {
    document.getElementById('loginModal').style.display = 'block';
});

document.getElementById('registerButton').addEventListener('click', () => {
    document.getElementById('registerModal').style.display = 'block';
});

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

window.onclick = function (event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }

    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
};
