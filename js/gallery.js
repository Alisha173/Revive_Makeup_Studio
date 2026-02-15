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
    intersectionFunction();
  } catch (err) {
    console.error(err);
    galleryGrid.innerHTML = "<p>Gallery unavailable at the moment.</p>";
  }
}

// const intersectionFunction=()=>{
// const isTouchDevice = window.matchMedia("(hover: none)").matches;

// if (isTouchDevice) {
//   const items = document.querySelectorAll(".gallery-item");

//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         items.forEach(item => item.classList.remove("active"));
//         entry.target.classList.add("active");
//       }
//     });
//   }, { threshold: 0.9 });

//   items.forEach(item => observer.observe(item));
// }
// }



const intersectionFunction = () => {
  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  if (!isTouchDevice) return;

  const items = document.querySelectorAll(".gallery-item");

  // store latest visibility ratios for every item
  const visibilityMap = new Map();

  const observer = new IntersectionObserver((entries) => {
    // update map whenever observer reports changes
    entries.forEach(entry => {
      visibilityMap.set(entry.target, entry.intersectionRatio);
    });

    // find the most visible element overall
    let bestItem = null;
    let bestRatio = 0;

    items.forEach(item => {
      const ratio = visibilityMap.get(item) || 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestItem = item;
      }
    });

    // remove active from all
    items.forEach(item => item.classList.remove("active"));

    // only activate the most visible one
    if (bestItem && bestRatio > 0) {
      bestItem.classList.add("active");
    }
  }, {
    threshold: Array.from({ length: 101 }, (_, i) => i / 100)
  });

  items.forEach(item => {
    visibilityMap.set(item, 0);
    observer.observe(item);
  });
};

function renderGallery(galleryGrid, data) {
  galleryGrid.innerHTML = data.map(item => `
    <div class="gallery-item ${item.category}" style="--after-text:'${item.alt}'">
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
