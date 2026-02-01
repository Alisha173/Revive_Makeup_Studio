let galleryData = [];

export default async function loadGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");

  //Safety check
  if (!galleryGrid || !filterButtons.length) {
    console.warn("Gallery DOM not found");
    return;
  }

  try {
    const res = await fetch("data/gallery.json");

    if (!res.ok) {
      throw new Error("Failed to load gallery data");
    }

    galleryData = await res.json();
    renderGallery(galleryGrid, galleryData);
    initFilters(filterButtons, galleryGrid);
  } catch (err) {
    console.error(err);
    galleryGrid.innerHTML = "<p>Gallery unavailable at the moment.</p>";
  }
}

function renderGallery(galleryGrid, data) {
  galleryGrid.innerHTML = data.map(item => `
    <div class="gallery-item ${item.category}">
      <img
        src="${item.src}"
        alt="${item.alt}"
        loading="lazy"
        decoding="async"
      />
    </div>
  `).join("");
}

function initFilters(filterButtons, galleryGrid) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      galleryGrid.querySelectorAll(".gallery-item").forEach(item => {
        const show =
          filter === "all" || item.classList.contains(filter);

        item.classList.toggle("hidden", !show);
      });
    });
  });
}
