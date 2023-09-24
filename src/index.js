import DomController from "./DomController";
import DataController from "./DataController";

const locationInput = document.querySelector("#location");
const submitBtn = document.querySelector(".submit");

const submitPressed = async (event) => {
  event.preventDefault();

  const locationVal = locationInput.value;
  DataController.getData(locationVal).then(DomController.render);
};

submitBtn.addEventListener("click", submitPressed);
