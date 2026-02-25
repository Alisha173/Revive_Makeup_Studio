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

  navLinks.addEventListener('click',(e)=>{
    if(e.target.tagName!=="A")return;
    e.currentTarget.classList.remove("active");
  })
  document.addEventListener('click',(e)=>{
    if(!navLinks.contains(e.target) && !navToggle.contains(e.target))
      navLinks.classList.remove("active");
  })
}


export function initHero() {
  const heroSlides = [
    {
      image: "assets/images/hero/pic1.png",
      badge: "Royal Bridal Excellence",
      title: "Where every bride shines",
      description: "Serving all the brides of Kerala"
    },
    {
      image: "assets/images/hero/test.png",
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
    const idx=currentIndex;
    slides[currentIndex].classList.add("exit");
    slides[currentIndex].classList.remove("active");
    setTimeout(() => {
    slides[idx].classList.remove("exit");
  }, 1000);

    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }, 5000);
}
