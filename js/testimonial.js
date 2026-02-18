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

const starIcon = `
  <svg
    class="testimonial-star"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/>
  </svg>
`;



function renderTestimonials(grid, data) {
  // 1. Define your limits here
  const MAX_CHARS_WITH_IMG = 200; // Less text allowed if image is present
  const MAX_CHARS_NO_IMG = 350;   // More text allowed if no image

  grid.innerHTML = data
    .map(item => {
      // --- Existing Star Logic ---
      const maxRating = 5;
      const rating = item.rating || 0;
      const stars = Array.from({ length: maxRating }, (_, i) => {
        return `
          <span class="star ${i < rating ? "filled" : "empty"}">
            ${starIcon}
          </span>
        `;
      }).join("");

      // --- Existing Image Logic ---
      const imageHTML = item.image
        ? `<img 
              src="${item.image}" 
              alt="${item.name}" 
              class="testimonial-image"
              loading="lazy"
            />`
        : "";

      // --- NEW: Truncation Logic ---
      // Determine which limit to use
      const charLimit = item.image ? MAX_CHARS_WITH_IMG : MAX_CHARS_NO_IMG;
      
      // Create a temporary variable for the text
      let displayedText = item.text;

      // Check length and truncate if necessary
      if (displayedText.length > charLimit) {
        // Cut at the limit, then back up to the last space found
        displayedText = displayedText.substring(0, charLimit);
        displayedText = displayedText.substring(0, displayedText.lastIndexOf(" ")) + "...";
      }

      return `
        <article class="testimonial-card">
          ${imageHTML}

          <div class="testimonial-text">
          
            ${quoteIcon}

            <div class="rating" aria-label="Rating: ${item.rating} out of 5">
              ${stars}
            </div>

            <blockquote>
              “${displayedText}”
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
}
