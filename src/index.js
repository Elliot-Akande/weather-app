import { format } from "date-fns";
import convertTime from "convert-time";

const locationInput = document.querySelector("#location");
const submitBtn = document.querySelector(".submit");

const getForecast = async (locationVal) => {
  const apiKey = "e1252673506548e2b9182745232209";
  const encLocation = encodeURI(locationVal);
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encLocation}`,
      { mode: "cors" }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message.includes("403") || error.message.includes("401")) {
      console.error(`Invalid API Key`);
    } else {
      console.error(`An error occurred: ${error.message}`);
    }
  }
};

const getWeatherData = async (locationVal) => {
  const { location, current, forecast } = await getForecast(locationVal);

  const data = {
    location: location.name,
    country: location.country,
    date: location.localtime,

    tempC: Math.floor(current.temp_c),
    tempF: Math.floor(current.temp_f),
    feelsLikeC: Math.floor(current.feelslike_c),
    feelsLikeF: Math.floor(current.feelslike_f),

    condition: current.condition,
    windSpeed: Math.floor(current.gust_mph),
    windDir: current.wind_degree,
    humidity: current.humidity,
    uv: current.uv,
    visibility: current.vis_miles,
    cloud: current.cloud,
    rainChance: forecast.forecastday[0].day.daily_chance_of_rain,
    sunrise: forecast.forecastday[0].astro.sunrise,
    sunset: forecast.forecastday[0].astro.sunset,
    moon: forecast.forecastday[0].astro.moon_phase,

    hour: forecast.forecastday[0].hour.map((item) => {
      const hourData = {
        tempC: Math.floor(item.temp_c),
        tempF: Math.floor(item.temp_f),
        feelsLikeC: Math.floor(item.feelslike_c),
        feelsLikeF: Math.floor(item.feelslike_f),

        time: item.time,
        condition: item.condition,
        windSpeed: Math.floor(item.gust_mph),
        windDir: item.wind_degree,
      };
      return hourData;
    }),
  };

  return data;
};

const domController = (() => {
  const isCelsius = true;


  const updateHeader = (data) => {
    const location = `${data.location}, ${data.country}`;
    const date = format(new Date(data.date), "eeee dd MMMM u | HH:mm");

    document.querySelector(".location").textContent = location;
    document.querySelector(".date").textContent = date;
  };


  const updateHourly = () => {};

  const render = (data) => {
    console.log(data);

    updateHeader(data);
  };

  return {
    render,
  };
})();

const submitPressed = async (event) => {
  event.preventDefault();

  const locationVal = locationInput.value;
  getWeatherData(locationVal).then(domController.render);
};

submitBtn.addEventListener("click", submitPressed);
