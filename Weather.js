const apiKey = '5035ef5276aa5051a32a406af7e9711e'; // Get from OpenWeatherMap

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
const city = document.getElementById('city-input').value;
getWeather(city);
});

function getWeather(city) {
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

fetch(apiUrl)
.then(response => response.json())
.then(data => displayWeather(data))
.catch(() => alert('City not found, please enter a valid city name along with the state or country.'));
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weather-result');
    const { name, main, weather, visibility, wind, sys, dt, timezone } = data;

    // Convert sunrise and sunset Unix timestamps to readable times, adjusting for timezone offset
    // The `sys.sunrise` and `sys.sunset` values are in UTC, so we add the timezone offset to get the local time.
    const sunriseTime = new Date((sys.sunrise + timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    const sunsetTime = new Date((sys.sunset + timezone) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

    // Correctly convert current time (dt) to a readable time by adding the timezone offset.
    // The OpenWeatherMap API returns `dt` in UTC. The `timezone` property is the offset in seconds from UTC.
    // By adding `dt` and `timezone` together, we get the local Unix timestamp.
    const localTimestamp = dt + timezone;
    const localDate = new Date(localTimestamp * 1000);
    const localTime = localDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

    weatherResult.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${main.temp}°F</p>
        <p>Condition: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Visibility: ${visibility / 1000} km</p>
        <p>Wind Speed: ${wind.speed} mph</p>
        <p>Sunrise: ${sunriseTime}</p>
        <p>Sunset: ${sunsetTime}</p>
        <p>Local Time: ${localTime}</p>
        <p>Local Date: ${localDate.toLocaleDateString()}</p>
    `;

    const localHour = localDate.getHours(); // Get the local hour from the localDate object

    // Apply CSS based on the local hour (using the body as an example)
    // Apply CSS based on the local hour (using the body as an example)
if (localHour >= 0 && localHour < 3) {
    document.body.style.backgroundColor = '#0C090A'; // Deep Night
} else if (localHour >= 3 && localHour < 6) {
    document.body.style.backgroundColor = '#DA7F7D'; // Pre-dawn/Sunrise
} else if (localHour >= 6 && localHour < 9) {
    document.body.style.backgroundColor = '#ffc400ff'; // Sunrise/Early Morning
} else if (localHour >= 9 && localHour < 12) {
    document.body.style.backgroundColor = '#568CD8'; // Morning
} else if (localHour >= 12 && localHour < 15) {
    document.body.style.backgroundColor = '#D8B382'; // Afternoon
} else if (localHour >= 15 && localHour < 18) {
    document.body.style.backgroundColor = '#FD5E53'; // Late Afternoon/Pre-sunset
} else if (localHour >= 18 && localHour < 21) {
    document.body.style.backgroundColor = '#4E518B'; // Sunset/Twilight
} else if (localHour >= 21 && localHour < 0) {
    document.body.style.backgroundColor = '#000614ff'; // Night
}
}