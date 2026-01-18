document.addEventListener("DOMContentLoaded", ()=>{

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });


    const heroSlides= [
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
    

    heroSlides.forEach((slide, index)=>{
        const slideEl=document.createElement("div");
        slideEl.className = `hero-slide ${index === 0 ? "active" : ""}`;

        slideEl.innerHTML = `
            <img src="${slide.image}" alt="">
            <div class="hero-content">
                <span class="hero-badge">${slide.badge}</span>
                <h2>${slide.title}</h2>
                <p>${slide.description}</p>
                <div class="hero-actions">
                    <a href="#booking" class="btn btn-book">Book Free Trial</a>
                    <a href="#contact" class="btn">Contact Us</a>
                </div>
            </div>
        `;
        carousel.appendChild(slideEl);
    });

    const slides = document.querySelectorAll(".hero-slide");
    let currentIndex = 0;
    function showSlide(newIndex){
        slides[currentIndex].classList.remove("active");
        slides[newIndex].classList.add("active");
        currentIndex=newIndex;
    }

    const len= slides.length;
    function nextSlide(){
        const nextIndex = (currentIndex+1) % len;
        showSlide(nextIndex);
    }

    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 5000;
    function startAutoplay(){
        if(autoplayInterval) return;

        autoplayInterval = setInterval(()=>{
            nextSlide();
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay(){
        clearInterval(autoplayInterval);
        autoplayInterval=null;
    }

    startAutoplay();
});
