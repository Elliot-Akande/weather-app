import "./style.css";
import { format } from "date-fns";
import svg from "svg";
import convertTime from "convert-time";
import windDirIcon from "./Wind Direction.svg";
import loadingIcon from "./Spinner.svg";
import DataController from "./DataController";

const locationInput = document.querySelector("#location");
const submitBtn = document.querySelector(".submit");
const tempBtns = document.querySelectorAll('[class^="temp"]');
let isCelsius = true;
let currentData;

const updateHeader = (data) => {
  const location = `${data.location}, ${data.country}`;
  const date = format(new Date(data.date), "eeee dd MMMM u | HH:mm");

  document.querySelector(".location").textContent = location;
  document.querySelector(".date").textContent = date;
};

const updateCurrent = (data) => {
  const temp = isCelsius ? `${data.tempC}°C` : `${data.tempF}°F`;
  const feelsLike = `Feels like ${
    isCelsius ? `${data.feelsLikeC}°C` : `${data.feelsLikeF}°F`
  }`;
  const windIcon = svg(windDirIcon);
  windIcon.style.transform = `rotate(${(data.windDir + 180) % 360}deg)`;
  const uvColour = (() => {
    if (data.uv < 3) return "var(--colour-warn-green)";
    if (data.uv < 6) return "var(--colour-warn-yellow)";
    if (data.uv < 8) return "var(--colour-warn-orange)";
    return "var(--colour-warn-red)";
  })();

  // Left Section
  document.querySelector(".main-icon").src = data.condition.icon;
  document.querySelector(".main-temp").textContent = temp;
  document.querySelector(".weather-desc").textContent = data.condition.text;
  document.querySelector(".feels-like").textContent = feelsLike;
  document.querySelector(".wind-desc").textContent = data.windDesc;

  // Right Section
  document.querySelector(".wind-today").textContent = `${data.windSpeed} mph`;
  document.querySelector(".wind-today").prepend(windIcon);
  document.querySelector(".humidity").textContent = `${data.humidity}%`;
  document.querySelector(".uv").textContent = data.uv;
  document.querySelector(".uv").style.background = uvColour;
  document.querySelector(".visibility").textContent = `${data.visibility} mi.`;
  document.querySelector(".cloudiness").textContent = `${data.cloud}%`;
  document.querySelector(".precipitation").textContent = `${data.precip} mm`;
  document.querySelector(".sunrise").textContent = convertTime(data.sunrise);
  document.querySelector(".sunset").textContent = convertTime(data.sunset);
  document.querySelector(".moon-icon").textContent = "";
  document.querySelector(".moon-icon").title = data.moon;
  import(`./${data.moon}.svg`).then((icon) => {
    document.querySelector(".moon-icon").appendChild(svg(icon.default));
  });
};

const updateHour = (data, hour) => {
  const container = document.querySelector(`[data-hour='${hour}']`);
  const time = format(new Date(data.time), "HH:mm");
  const temp = isCelsius ? `${data.tempC}°` : `${data.tempF}°`;
  const feelsLike = `Feels like ${
    isCelsius ? `${data.feelsLikeC}°` : `${data.feelsLikeF}°`
  }`;
  const wind = `${data.windSpeed} mph`;
  const windIcon = svg(windDirIcon);
  windIcon.style.transform = `rotate(${(data.windDir + 180) % 360}deg)`;

  container.querySelector(".time").textContent = time;
  container.querySelector(".hour-icon>img").src = data.condition.icon;
  container.querySelector(".hour-temp").textContent = temp;
  container.querySelector(".hour-desc").textContent = data.condition.text;
  container.querySelector(".hour-feels").textContent = feelsLike;
  container.querySelector(".hour-wind").textContent = wind;
  container.querySelector(".hour-wind-desc").textContent = data.windDesc;
  container.querySelector(".hour-wind-icon").textContent = "";
  container.querySelector(".hour-wind-icon").appendChild(windIcon);
};

const render = (data = currentData) => {
  if (data !== currentData) currentData = data;
  updateHeader(data);
  updateCurrent(data);
  data.hour.forEach(updateHour);
};

tempBtns.forEach((item) =>
  item.addEventListener("click", (event) => {
    const wasCelsius = isCelsius;
    isCelsius = event.currentTarget.classList.contains("temp-c");
    if (wasCelsius !== isCelsius) {
      tempBtns.forEach((elem) => elem.classList.toggle("active"));
      render();
    }
  })
);

const showError = (code) => {
  document.querySelector(".error")?.remove();

  const errDiv = document.createElement("div");
  const err = document.createElement("div");
  errDiv.classList.add("error");

  if (code === 1006) err.textContent = "Location not found";
  // else if (code === 1003) err.textContent = "Please enter a location";
  else err.textContent = `WeatherAPI Error: Code ${code}`;

  errDiv.appendChild(err);
  document.querySelector("body").appendChild(errDiv);
};

const getData = (locationValue) => {
  const loadingDiv = document.createElement("div");
  const loading = svg(loadingIcon);

  loadingDiv.classList.add("loading-container");
  loadingDiv.appendChild(loading);
  document.querySelector("body").appendChild(loadingDiv);

  DataController.getData(locationValue).then((data) => {
    loadingDiv.remove();
    if (!Object.prototype.hasOwnProperty.call(data, "error")) {
      render(data);
      document.querySelector(".error")?.remove();
      document.querySelector(".weather").classList.toggle("hidden");
    } else {
      showError(data.error);
    }
  });
};

submitBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const input = locationInput.value;
  if (input.length > 0) {
    const weatherDiv = document.querySelector(".weather");
    weatherDiv.classList.add("hidden");
    getData(input);
  }
});

getData("Glasgow");
