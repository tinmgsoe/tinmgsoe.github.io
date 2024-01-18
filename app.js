const apiKey = 'c88596ef839a08b876ef375003ca1fad';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Function to get extended weather forecast data
async function getExtendedForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

// Function to get current weather data
async function getWeather(city) {
    const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}

// Function to update the UI with current weather data
function updateUI(data) {
    document.getElementById('location').textContent = data.name + ', ' + data.sys.country;
    document.getElementById('temperature').textContent = data.main.temp + '°C';
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('icon').innerHTML = `<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">`;

    const weatherCondition = data.weather[0].icon.substring(0, 2);

    const weatherContainer = document.querySelector('.weather-container');
    weatherContainer.className = 'weather-container';
    if (weatherCondition === '01') {
        weatherContainer.classList.add('clear');
    } else if (weatherCondition === '02' || weatherCondition === '03' || weatherCondition === '04') {
        weatherContainer.classList.add('clouds');
    } else if (weatherCondition === '09' || weatherCondition === '10') {
        weatherContainer.classList.add('rain');
    }
}

function updateExtendedForecast(data) {
    const extendedForecastContainer = document.getElementById('extendedForecast');
    extendedForecastContainer.innerHTML = ''; // Clear previous content

    // Loop through the forecast data and display information for each day
    data.list.forEach(forecast => {
        const timestamp = forecast.dt * 1000; // Convert timestamp to milliseconds
        const date = new Date(timestamp);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
        const temperature = forecast.main.temp.toFixed(1);

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `<p>${dayOfWeek}</p><p>${time}</p><p>${temperature}°C</p>`;

        extendedForecastContainer.appendChild(forecastItem);
    });
}

// Function to get weather data by city and fetch extended forecast
async function getWeatherByCity() {
    const cityInput = document.getElementById('cityInput').value;
    if (cityInput.trim() === "") {
        alert("Please enter a city name.");
        return;
    }

    try {
        // Fetch current weather data
        const data = await getWeather(cityInput);
        updateUI(data);

        // Fetch extended weather forecast data and update the UI
        const extendedForecastData = await getExtendedForecast(cityInput);
        updateExtendedForecast(extendedForecastData);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error fetching weather data: ${error.message}`);
    }
}

// Fetch weather data and update the UI for the default city (London)
getWeather('')
    .then(data => updateUI(data))
    .catch(error => console.error('Error fetching weather data:', error));
