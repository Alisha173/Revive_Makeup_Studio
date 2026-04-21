let testimonialsData = [];

export default async function loadTestimonials() {
  const grid = document.getElementById("testimonialsGrid");

  // Safety check (SPA timing)
  if (!grid) {
    console.warn("Testimonials grid not found in DOM");
    return;
  }

  try {
    const res = await fetch("data/testimonials.json");

    if (!res.ok) {
      throw new Error("Failed to load testimonials data");
    }

    testimonialsData = await res.json();
    renderTestimonials(grid, testimonialsData);

  } catch (err) {
    console.error(err);
    grid.innerHTML =
      "<p style='text-align:center'>Testimonials unavailable at the moment.</p>";
  }
}

const quoteIcon = `
  <svg
    class="testimonial-quote-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
  </svg>
`;

function renderTestimonials(grid, data) {
  grid.innerHTML = data
    .map((item, cardIndex) => {

      // --- NEW: Image Carousel Logic ---
      const imageCarousel = Array.isArray(item.image) && item.image.length > 0 ? `
        <div class="testimonial-image-carousel" data-card-index="${cardIndex}" data-current-image="0">
          <img 
            src="${item.image[0]}" 
            alt="${item.name}" 
            class="testimonial-image"
            loading="lazy"
            data-card-index="${cardIndex}"
          />
          ${item.image.length > 1 ? `
            <button class="carousel-btn prev-btn" data-card-index="${cardIndex}" aria-label="Previous image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="carousel-btn next-btn" data-card-index="${cardIndex}" aria-label="Next image">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <div class="image-counter">${1} / ${item.image.length}</div>
          ` : ''}
        </div>
      ` : '';

      return `
        <article class="testimonial-card">
          ${imageCarousel}

          <div class="testimonial-text">
          
            ${quoteIcon}

            <blockquote>
              "${item.text}"
            </blockquote>

            <footer>
              <div class="client-name">${item.name}</div>
              <div class="client-meta">
                <span class="meta-item">${item.subtitle}</span>
                <span class="meta-item">${item.location}</span>
                <span class="meta-item">${item.date}</span>
              </div>
            </footer>
          
          </div>

        </article>
      `;
    })
    .join("");

  // Attach carousel event listeners
  attachCarouselHandlers(data);
}

function attachCarouselHandlers(data) {
  // Handle next button clicks
  document.querySelectorAll(".carousel-btn.next-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const cardIndex = parseInt(btn.dataset.cardIndex);
      const carousel = document.querySelector(`.testimonial-image-carousel[data-card-index="${cardIndex}"]`);
      const img = carousel.querySelector("img");
      const counter = carousel.querySelector(".image-counter");
      const images = data[cardIndex].image;
      
      let currentIndex = parseInt(carousel.dataset.currentImage);
      currentIndex = (currentIndex + 1) % images.length;
      
      carousel.dataset.currentImage = currentIndex;
      img.src = images[currentIndex];
      img.alt = `${data[cardIndex].name} - Image ${currentIndex + 1}`;
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    });
  });

  // Handle prev button clicks
  document.querySelectorAll(".carousel-btn.prev-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const cardIndex = parseInt(btn.dataset.cardIndex);
      const carousel = document.querySelector(`.testimonial-image-carousel[data-card-index="${cardIndex}"]`);
      const img = carousel.querySelector("img");
      const counter = carousel.querySelector(".image-counter");
      const images = data[cardIndex].image;
      
      let currentIndex = parseInt(carousel.dataset.currentImage);
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      
      carousel.dataset.currentImage = currentIndex;
      img.src = images[currentIndex];
      img.alt = `${data[cardIndex].name} - Image ${currentIndex + 1}`;
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    });
  });
}
