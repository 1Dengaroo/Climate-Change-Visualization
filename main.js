import Introduction from "./components/introduction.js";
import Causes from "./components/climate_causes.js";
import Impacts from "./components/climate_impacts.js";

document.querySelector("#welcome").innerHTML += Introduction();
document.querySelector("#climate-causes").innerHTML += Causes();
document.querySelector("#climate-impacts").innerHTML += Impacts();
