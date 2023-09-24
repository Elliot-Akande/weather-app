const DataController = (() => {
  const fetchData = async (locationVal) => {
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

  const getData = async (locationVal) => {
    const { location, current, forecast } = await fetchData(locationVal);

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
      // One decimal place
      precip: Math.round(current.precip_mm * 10) / 10,
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

  return {
    getData,
  };
})();

export default DataController;
