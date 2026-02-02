document.addEventListener("DOMContentLoaded", () => {
  initNav();
});

function initNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}


export function initHero() {
  const heroSlides = [
    {
      image: "assets/images/bride1.jpg",
      badge: "Royal Bridal Excellence",
      title: "Where every bride shines",
      description: "Serving all the brides of Kerala"
    },
    {
      image: "assets/images/bride1.jpg",
      badge: "Luxury Makeup",
      title: "Elegance for your special day",
      description: "Premium bridal artistry"
    }
  ];

  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

  carousel.innerHTML = "";

  heroSlides.forEach((slide, index) => {
    const slideEl = document.createElement("div");
    slideEl.className = `hero-slide ${index === 0 ? "active" : ""}`;

    slideEl.innerHTML = `
            <img src="${slide.image}" alt="">
            <div class="container">
            
                <div class="hero-content">
                    <span class="hero-badge">${slide.badge}</span>
                    <h2>${slide.title}</h2>
                    <p>${slide.description}</p>
                    <div class="hero-actions">
                        <a href="#booking" class="btn btn-book">Book Free Trial</a>
                        <a href="#contact" class="btn">Contact Us</a>
                    </div>
                </div>

            </div>
        `;
        carousel.appendChild(slideEl);
  });

  let currentIndex = 0;
  const slides = carousel.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  setInterval(() => {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }, 5000);
}
