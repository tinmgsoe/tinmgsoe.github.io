
const apiKey = 'c88596ef839a08b876ef375003ca1fad';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';


async function getWeather(city) {
    const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
}


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


async function getWeatherByCity() {
    const cityInput = document.getElementById('cityInput').value;
    if (cityInput.trim() === "") {
        alert("Please enter a city name.");
        return;
    }

    try {
        const data = await getWeather(cityInput);
        updateUI(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}


getWeather('London')
    .then(data => updateUI(data))
    .catch(error => console.error('Error fetching weather data:', error));
