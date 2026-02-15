const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios'); 
const app = express();
dotenv.config();
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {     
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/weather', async (req, res) => {
  const { city } = req.body;
  const apiKey = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data)
    res.json({ 
      city: data.name,
      temperature: data.main.temp,
      feelsLike:data.main.feels_like,
      minTemp: data.main.temp_min,   
      maxTemp: data.main.temp_max,  
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    });
  } catch (err) {
    res.status(404).json({ error: 'City not found' });
  }
});
app.post('/weather-by-coords', async (req, res) => {
  const { lat, lon } = req.body;
  const apiKey = process.env.WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json({
      city: data.name,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      minTemp: data.main.temp_min,
      maxTemp: data.main.temp_max,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch weather data' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

