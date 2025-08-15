const apiKey = 'Your-API-Key'; // Get from OpenWeatherMap

const timeRanges = [
  { start: 0, end: 1, color: '#00001a' },   // Midnight (Deep, dark blue)
  { start: 1, end: 2, color: '#0a0a29' },   // Late Night
  { start: 2, end: 3, color: '#14143d' },   // Late Night
  { start: 3, end: 4, color: '#1e1e52' },   // Pre-dawn
  { start: 4, end: 5, color: '#4d4d6e' },   // Pre-dawn light
  { start: 5, end: 6, color: '#9d9db4' },   // Dawn (Soft gray-blue)
  { start: 6, end: 7, color: '#c3a28b' },   // Sunrise (Soft browns and pinks)
  { start: 7, end: 8, color: '#ffb56b' },   // Early Morning (Golden light)
  { start: 8, end: 9, color: '#ffdc7d' },   // Morning (Brighter golden)
  { start: 9, end: 10, color: '#74aaff' },  // Morning (Clear blue sky)
  { start: 10, end: 11, color: '#4990ff' }, // Mid-morning (Vivid blue sky)
  { start: 11, end: 12, color: '#4990ff' }, // Late Morning (Vivid blue sky)
  { start: 12, end: 13, color: '#74aaff' }, // Midday (Slightly paler blue)
  { start: 13, end: 14, color: '#74aaff' }, // Early Afternoon
  { start: 14, end: 15, color: '#97bfff' }, // Mid-afternoon (Lightening blue)
  { start: 15, end: 16, color: '#cce2ff' }, // Late Afternoon (Even lighter blue)
  { start: 16, end: 17, color: '#ff9a59' }, // Pre-sunset (Orange-pink)
  { start: 17, end: 18, color: '#ff7b33' }, // Sunset (Vibrant orange)
  { start: 18, end: 19, color: '#b8492c' }, // Late Sunset (Deepening red-orange)
  { start: 19, end: 20, color: '#703357' }, // Twilight (Purple-gray)
  { start: 20, end: 21, color: '#412255' }, // Early Night
  { start: 21, end: 22, color: '#2b153d' }, // Night
  { start: 22, end: 23, color: '#1f0d38' }, // Deep Night
  { start: 23, end: 24, color: '#14002e' }  // Deep Night
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
