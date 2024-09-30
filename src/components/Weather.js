import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const API_KEY = "4b408fedda8e4299d5c0f992aa175bec";

    // Fetch weather by city name
    const fetchWeatherByCity = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            setWeatherData(response.data);
            setError("");
        } catch (error) {
            setError("City not found. Please try again.");
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch weather by coordinates (latitude & longitude)
    const fetchWeatherByLocation = async (lat, lon) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            setWeatherData(response.data);
            setError("");
        } catch (error) {
            setError("Unable to retrieve weather data for your location.");
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    // Get user's current location using Geolocation API
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByLocation(latitude, longitude);
                },
                (error) => {
                    setError("Location access denied. Please enter a city name.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (city) fetchWeatherByCity();
    };

    // Get weather automatically on first load if geolocation is available
    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div className="weather-app">
            <h1>Weather App</h1>
            <form onSubmit={handleSearch} className="weather-form">
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                {/* Container for the buttons */}
                <div className="button-container">
                    <button type="submit">Get Weather</button>
                    <button type="button" onClick={getLocation}>
                        Use My Location
                    </button>
                </div>
            </form>


            {loading && <p>Loading...</p>}

            {error && <p>{error}</p>}

            {weatherData && (
                <div>
                    <h3>
                        {weatherData.name}, {weatherData.sys.country}
                    </h3>
                    <p>Temperature: {weatherData.main.temp}°C</p>
                    <p>Weather: {weatherData.weather[0].description}</p>
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                </div>
            )}
        </div>
    );
};

export default Weather;
