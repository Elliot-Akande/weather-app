const location = document.querySelector("#location");
const submitBtn = document.querySelector(".submit");

const getWeatherData = async (locationVal) => {
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

const submitPressed = async (event) => {
  event.preventDefault();

  const locationVal = location.value;
  const dataPromise = await getWeatherData(locationVal);

  console.log(dataPromise);
};

submitBtn.addEventListener("click", submitPressed);
