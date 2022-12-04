import Introduction from "./components/introduction.js";
import Causes from "./components/climate_causes.js";
import Impacts from "./components/climate_impacts.js";

document.querySelector(".container").innerHTML += Introduction();
document.querySelector(".container").innerHTML += Causes();
document.querySelector(".container").innerHTML += Impacts();
