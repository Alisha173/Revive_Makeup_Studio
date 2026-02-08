import loadSection from "./spaLoader.js";
import { initHero } from "./main.js";
import loadGallery from "./gallery.js";
import loadTestimonials from "./testimonial.js";


function handleRoute() {
  const hash = location.hash || "#home";

  switch (hash) {
    case "#home":
      loadSection("pages/home.html", initHero);
      break;

    case "#gallery":
      loadSection("pages/gallery.html", loadGallery);
      break;

    case "#testimonials":
      loadSection("pages/testimonial.html", loadTestimonials);
      break;

    default:
      loadSection("pages/home.html", initHero);
  }
}

window.addEventListener("DOMContentLoaded", handleRoute);
window.addEventListener("hashchange", handleRoute);
