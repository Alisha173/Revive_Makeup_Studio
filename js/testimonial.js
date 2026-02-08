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

function renderTestimonials(grid, data) {
  grid.innerHTML = data
    .map(item => {
      // Build stars from rating
      const stars = "★".repeat(item.rating || 0);

      // Optional image block
      const imageHTML = item.image
        ? `<img 
             src="${item.image}" 
             alt="${item.name}" 
             class="testimonial-image"
             loading="lazy"
           />`
        : "";

      return `
        <article class="testimonial-card">
          ${imageHTML}

          <blockquote>
            “${item.text}”
          </blockquote>

          <footer>
            <div class="client-name">${item.name}</div>
            <div class="client-meta">
              ${item.subtitle} • ${item.location} • ${item.date}
            </div>
            <div class="rating" aria-label="Rating: ${item.rating} out of 5">
              ${stars}
            </div>
          </footer>
        </article>
      `;
    })
    .join("");
}
