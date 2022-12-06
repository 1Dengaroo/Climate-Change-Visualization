import Introduction from "./components/introduction.js";
import Causes from "./components/climate_causes.js";
import Impacts from "./components/climate_impacts.js";
import Greenhouse from "./components/greenhouse.js";
import Greenhouse_C from "./components/greenhouse_c.js";

document.querySelector("#welcome").innerHTML += Introduction();
document.querySelector("#climate-causes").innerHTML += Causes();
document.querySelector("#climate-impacts").innerHTML += Impacts();
document.querySelector("#greenhouse").innerHTML += Greenhouse();
document.querySelector("#greenhouse-conclusion").innerHTML += Greenhouse_C();
// document.querySelector("#plastic").innerHTML += Plastic();
