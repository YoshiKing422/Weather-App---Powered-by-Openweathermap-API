const apiKey = 'Your-API-Key'; // Get from OpenWeatherMap

const timeRanges = [
  { start: 0, end: 3, color: '#0C090A' },   // Deep Night
  { start: 3, end: 6, color: '#DA7F7D' },   // Pre-dawn/Sunrise
  { start: 6, end: 9, color: '#ffc400ff' }, // Sunrise/Early Morning
  { start: 9, end: 12, color: '#568CD8' },  // Morning
  { start: 12, end: 15, color: '#D8B382' }, // Afternoon
  { start: 15, end: 18, color: '#FD5E53' }, // Late Afternoon/Pre-sunset
  { start: 18, end: 21, color: '#4E518B' }, // Sunset/Twilight
  { start: 21, end: 24, color: '#000614ff' } // Night
];

const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
const city = document.getElementById('city-input').value;
getWeather(city);
});

function getWeather(city) {
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`; // Using imperial units for Fahrenheit, you can change to metric for Celsius

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

const currentRange = timeRanges.find(range => localHour >= range.start && localHour < range.end);

if (currentRange) {
  document.body.style.backgroundColor = currentRange.color;
}
}