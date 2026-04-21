document.addEventListener("DOMContentLoaded",initNav);
let navToggle ;
let navLinks ;
let autoPlay;
function hdlClick1(){
   navLinks.classList.toggle("active");
}
function hdlClick2(e){
   if(e.target.tagName!=="A")return;
    e.currentTarget.classList.remove("active");
}
function hdlClick3(e){
   if(!navLinks || !navToggle) return;

  if(!navLinks.contains(e.target) && !navToggle.contains(e.target))
      navLinks.classList.remove("active");
}

function initNav() {
  navToggle = document.querySelector(".nav-toggle");
  navLinks = document.querySelector(".nav-links");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", hdlClick1);

  navLinks.addEventListener('click',hdlClick2);

  document.addEventListener('click',hdlClick3);
  const callBtn = document.getElementById("callBtn");
const popup = document.getElementById("callPopup");
const closeBtn = document.getElementById("closePopup");

callBtn.addEventListener("click", () => {
  popup.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  popup.classList.remove("active");
});

popup.addEventListener("click", (e) => {
  if (e.target === popup || e.target.closest("a")) {
    popup.classList.remove("active");
  }
});
}


export function initHero() {
  const heroSlides = [
    {
      image: "assets/images/hero/b1.webp",
      badge: "Royal Bridal Excellence",
      title: "Where every bride shines",
      description: "Serving all the brides of Kerala"
    },
    {
      image: "assets/images/hero/b2.webp",
      badge: "Luxury Makeup",
      title: "Elegance for your special day",
      description: "Premium bridal artistry"
    },
    {
      image: "assets/images/hero/b3.webp",
      badge: "Signature Experience",
      title: "Luxury beyond beauty",
      description: "Indulge in world-class salon care"
    }
  ];

  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

  // carousel.innerHTML = ` <div class="container">
            
  //               <div class="hero-content">
  //                   <span class="hero-badge">Royal Bridal Excellence</span>
                    
  //                   <div>
  //                       <p>Where every bride shines</p>
  //                        <div class="hero-actions">
  //                         <a href="#callback" class="btn btn-book">Book Free Trial</a>
  //                           <a href="#contact" class="btn">Contact Us</a>
  //                       </div>
  //                   </div>
                    
  //               </div>

  //           </div>
  // </div>`;

carousel.innerHTML= `<div class="container">
            
                <div class="hero-content">
                    <span class="hero-badge">Royal Bridal Excellence</span>
                    <h1 class="heroHead">Where every bride shines</h1>
                    <p>Serving all the brides of Kerala</p>
                    <div class="hero-actions">
                        <a href="#callback" class="btn btn-book">Book Free Trial</a>
                        <a href="#contact" class="btn">Contact Us</a>
                    </div>
                </div>

            </div>
  </div> `;


  heroSlides.forEach((slide, index) => {
    const slideEl = document.createElement("div");
    slideEl.className = `hero-slide ${index === 0 ? "active" : ""}`;

    slideEl.innerHTML = `
            <img src="${slide.image}" alt="" fetchpriority="high">
            
        `;
        carousel.appendChild(slideEl);
  });

  let currentIndex = 0;
  const slides = carousel.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  if (autoPlay) clearInterval(autoPlay);
  autoPlay=setInterval(() => {
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

export function destroyHero(){
  clearInterval(autoPlay);
  autoPlay = null;
  navLinks?.classList.remove("active");
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;

  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

  initHero();
});