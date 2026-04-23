document.addEventListener("DOMContentLoaded",initNav);
let navToggle ;
let navLinks ;
let autoPlay;
let handleBtn;
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

  const nav = document.querySelector(".navbar");
document.documentElement.style.setProperty(
  "--nav-height",
  nav.offsetHeight + "px"
);

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

let lastScrollY = window.scrollY;
const navbar = document.querySelector(".site-header");
const navHeight=navbar.offsetHeight;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  if (Math.abs(currentScrollY - lastScrollY) < 5) return;
  if(currentScrollY>navHeight && currentScrollY>lastScrollY){
    navbar.classList.add("hide");
  }else{
    navbar.classList.remove("hide");
  }
  lastScrollY = currentScrollY;
});

  document.body.addEventListener("click",(e)=>{
    const bookPackageButton=e.target.closest(".bookPackageButton");
    if(!bookPackageButton)return;
    popup.classList.add("active");
    const bookBtn = e.target.closest(".bkNow");
    if (bookBtn) {

    const card = bookBtn.closest(".pkgSlide");
    const packageName = card.querySelector("h3").textContent;

    sessionStorage.setItem("selectedPackage", packageName);
    return; 
  }
    const bookBtn2=e.target.closest(".btn-book-now");
    if(bookBtn2){
      const parentElement=bookBtn2.parentElement;
      const pkgName=parentElement.querySelector(".package-name").textContent;
      sessionStorage.setItem("selectedPackage", pkgName);
    }
  });

  const setRealVh=()=>{
    const vh=window.innerHeight*0.01;
    document.documentElement.style.setProperty("--real-vh",`${vh}px`);
  }
  setRealVh();

}


export function initHero() {
  const heroSlides = [
    { image: "assets/images/bridal/b1_2.webp" },
    { image: "assets/images/bridal/b6_1.webp"},
    { image: "assets/images/bridal/b4_5.webp", }
  ];

  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

carousel.innerHTML= `<div class="container">
            
                <div class="hero-content">
                    <span class="hero-badge">Premium Bridal Artistry</span>
                    <h1 class="heroHead">Where every bride shines</h1>
                    <p>Serving all brides of South India</p>
                    <div class="hero-actions">
                        <button class="btn btn-book bookPackageButton">Book Free Trial</button>
                        <a id="contactBtn" class="btn">Contact Us</a>
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

  handleBtn=()=>{
    const el=document.querySelector("#lookStunning");
    if(!el)return;
    el.scrollIntoView({behavior:"smooth"});
    // const yOffset=el.getBoundingClientRect().top+window.pageYOffset;
    // window.scrollTo({top:yOffset,behavior:"smooth"});
  }

  const contactBtn=document.querySelector("#contactBtn");
  if(contactBtn)
    contactBtn.addEventListener("click",handleBtn);

}

export function destroyHero(){
  clearInterval(autoPlay);
  autoPlay = null;
  navLinks?.classList.remove("active");
  const contactBtn=document.querySelector("#contactBtn");
  if(contactBtn)
    contactBtn.removeEventListener("click",handleBtn);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;

  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

  initHero();
});