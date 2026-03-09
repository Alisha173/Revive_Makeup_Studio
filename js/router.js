import loadSection from "./spaLoader.js";
import { initHero,destroyHero } from "./main.js";
import loadGallery from "./gallery.js";
import loadTestimonials from "./testimonial.js";
import initCallbackForm from "./callback.js";
import {initOurWork,destroyOurWork} from "./ourWork.js";
let cleanup=null;
import loadPackages from "./packages.js"; // Removed the duplicate import

function handleRoute() {
  const hash = location.hash || "#home";

  if(cleanup){
    cleanup();
    cleanup=null;
  }

  switch (hash) {
    case "#home":
      loadSection("pages/home.html", ()=>{
        
        initHero();
        initOurWork();
        cleanup=()=>{
        destroyHero();
        destroyOurWork();
        }
      });
      break;

    case "#gallery":
      loadSection("pages/gallery.html", loadGallery);
      break;

    case "#testimonials":
      loadSection("pages/testimonial.html", loadTestimonials);
      break;

    case "#callback":
      loadSection("pages/callback.html", initCallbackForm);
      break;
    case "#packages":
      loadSection("pages/packages.html", loadPackages);
      break; // <-- Added the missing break statement here

    default:
      loadSection("pages/home.html", ()=>{
        
        initHero();
        initOurWork();
        cleanup=()=>{
        destroyHero();
        destroyOurWork();
        }
      });
  }

  window.scrollTo(0, 0);
}

window.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);