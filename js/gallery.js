
import { initLightbox, openLightbox } from './lightbox.js';


const galleryIcons = {
  all: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  bridal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /><path d="M5 21h14" /></svg>`,
  party: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/></svg>`,
  professional: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M11.5 20h-6.5a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" /></svg>`,
 folder: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder-plus" viewBox="0 0 16 16"><path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z"/><path d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5"/></svg>`,

};

function initGalleryIcons() {
  // CHANGED: Select from .filter-capsule instead of .gallery-filters
  document.querySelectorAll(".filter-capsule [data-icon]").forEach((el) => {
    const iconName = el.dataset.icon;
    if (galleryIcons[iconName]) {
      el.innerHTML = galleryIcons[iconName];
    }
  });
}

export default async function loadGallery() {
  initGalleryIcons();

  const galleryGrid = document.getElementById("galleryGrid");
  // CHANGED: Query for .filter-item instead of .filter-btn
  const filterButtons = document.querySelectorAll(".filter-item");

  if (!galleryGrid || !filterButtons.length) {
    console.warn("Gallery DOM not found: check if HTML classes match JS selectors");
    return;
  }

  try {
    const res = await fetch("data/gallery.json");
    if (!res.ok) throw new Error("Failed to load gallery data");

    const galleryData = await res.json();
    renderGallery(galleryGrid, galleryData);
    initFilters(filterButtons, galleryGrid);
    intersectionFunction();
    initLightbox(galleryData);

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

let currentGalleryData = []; 

function renderGallery(galleryGrid, data) {
  currentGalleryData = data;
  const template = document.querySelector("#card-template");
  galleryGrid.innerHTML = ""; 

  data.forEach((set, setIndex) => {
    const clone = template.content.cloneNode(true);
    const div = clone.querySelector(".gallery-item");
    const img = clone.querySelector("img");

    const badgeIcon = clone.querySelector(".badge-icon");
    const badgeNum = clone.querySelector(".badge-num");
    
    if(badgeIcon) badgeIcon.innerHTML = galleryIcons.folder;
    if(badgeNum) badgeNum.textContent = set.images.length;

    // Pulling the first image of the set
    const firstImage = set.images[0];

    div.classList.add(set.category);
    div.dataset.setId = set.id;
    div.dataset.setIndex = setIndex;

    // Set fallback: hide the item if the image path is broken
    img.onerror = () => {
      div.style.display = "none";
    };

    div.style.setProperty('--after-text', `"${firstImage.alt}"`);
    img.setAttribute('data-src', firstImage.src); 
    img.setAttribute('alt', firstImage.alt);;

    // Placeholder for Phase 2 Lightbox trigger
    // Change this line (around line 123 of gallery.js)
    div.addEventListener('click', () => openLightbox(setIndex)); // Use setIndex, not index

    if (setIndex === 0) {
      div.classList.add("intro-active");
      div.classList.add("pulse-trigger");
      
      const notice = div.querySelector(".gallery-item-notice");
      if (notice) {
        // A 100ms delay ensures the browser paints the "hidden" state first,
        // which forces the slide-up transition to actually play on load.
        setTimeout(() => {
          div.classList.add("show-notice");
        }, 200);
      }
      
      // Clean up after 6 seconds
      setTimeout(() => {
        div.classList.remove("intro-active");
        div.classList.remove("pulse-trigger");
        
        // This will now trigger the slide back DOWN behind the image
        if (notice) {
          div.classList.remove("show-notice");
        }
      }, 6000);
    }

    galleryGrid.appendChild(clone);
  });
  
  // Re-run intersection observer if it exists to pick up new elements
  if(typeof intersectionFunction === 'function') intersectionFunction();

  initLazyLoading();

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
        const show = filter === "all" || item.classList.contains(filter);
        item.classList.toggle("hidden", !show);
      });
    });
  });
}

// The Lazy Load Intersection Observer
function initLazyLoading() {
  const lazyImages = document.querySelectorAll(".lazy-image");
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Copy the URL from data-src into the real src
        img.src = img.dataset.src;
        
        // Only fade in AFTER the browser has fully downloaded it
        img.onload = () => {
          img.classList.add("lazy-loaded");
        };
        
        // Stop watching this specific image to save memory
        observer.unobserve(img);
      }
    });
  }, {
    // Look 500px above and below the current screen
    rootMargin: "500px 0px 500px 0px" 
  });

  lazyImages.forEach(img => imageObserver.observe(img));
} 