import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherAppcomponents.css';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const apiKey = '61e78f752dbe4c2fab154508231309';

  useEffect(() => {
    // Fetch weather data for the current location when the component loads
    fetchWeatherDataByCoords();
  }, []);

  const fetchWeatherDataByCoords = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(latitude, longitude);
    });
  };

  const fetchWeatherData = (lat, lon) => {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
    axios
      .get(apiUrl)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  const fetchWeatherDataByQuery = (query) => {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`;
    axios
      .get(apiUrl)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherDataByQuery(searchQuery);
  };

  // Determine the weather condition CSS class based on the data
  const weatherConditionClass = weatherData ? (
    weatherData.current.condition.text.toLowerCase().includes('sunny')
      ? 'weather-sunny'
      : 'weather-rainy'
  ) : '';

  return (
    <div className={`weather-app ${weatherConditionClass}`}>
      <h1>Weather App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a city"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={fetchWeatherDataByCoords}>Fetch Current Location Weather</button>
      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.location.name}, {weatherData.location.country}</h2>
          <div className="weather-condition">
            {weatherData.current.condition.text}
          </div>
          <div>Temperature: {weatherData.current.temp_c}°C / {weatherData.current.temp_f}°F</div>
          <div>Humidity: {weatherData.current.humidity}%</div>
          <div>Wind Speed: {weatherData.current.wind_kph} kph</div>
          <div>UV Index: {weatherData.current.uv}</div>
          <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} />
          <div>Latitude: {weatherData.location.lat}</div>
          <div>Longitude: {weatherData.location.lon}</div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;