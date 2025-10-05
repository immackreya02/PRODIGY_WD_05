const apiKey = 'b6bcc6fc3bb4cf04273ead5be8b9f623';
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDiv = document.getElementById('weather');
const locationEl = document.getElementById('location');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const weatherIcon = document.getElementById('weatherIcon');
const errorEl = document.getElementById('error');

function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(1);
}
function getWeatherByCoords(lat, lon) {
    errorEl.textContent = '';
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )
        .then((res) => {
            if (!res.ok) throw new Error('Unable to fetch weather data');
            return res.json();
        })
        .then((data) => updateWeather(data))
        .catch((err) => {
            weatherDiv.classList.add('hidden');
            errorEl.textContent = err.message;
        });
}
function getWeatherByCity(city) {
    errorEl.textContent = '';
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    )
        .then((res) => {
            if (!res.ok) throw new Error('City not found');
            return res.json();
        })
        .then((data) => updateWeather(data))
        .catch((err) => {
            weatherDiv.classList.add('hidden');
            errorEl.textContent = err.message;
        });
}
function updateWeather(data) {
    locationEl.textContent = `${data.name}, ${data.sys.country}`;
    temperatureEl.textContent = `${kelvinToCelsius(data.main.temp)} °C`;
    descriptionEl.textContent = data.weather[0].description;
    humidityEl.textContent = data.main.humidity;
    windEl.textContent = data.wind.speed;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    weatherDiv.classList.remove('hidden');
}
function detectLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getWeatherByCoords(
                    position.coords.latitude,
                    position.coords.longitude
                );
            },
            () => {
                errorEl.textContent =
                    'Geolocation permission denied. Please enter city manually.';
            }
        );
    } else {
        errorEl.textContent = 'Geolocation not supported. Please enter city.';
    }
}
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});
window.onload = detectLocation;
