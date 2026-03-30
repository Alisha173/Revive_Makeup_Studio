// lightbox.js

let localData = [];
let activeSetIndex = 0;
let activeImgIndex = 0;

let touchStartX = 0;
let touchEndX = 0;

export function initLightbox(data) {
  localData = data; // Receive data from gallery.js
  setupEventListeners();
}

export function openLightbox(setIndex) {
  const lightbox = document.getElementById("lightbox");
  activeSetIndex = setIndex;
  activeImgIndex = 0;

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
  renderLightboxContent();
}

function renderLightboxContent() {
  const set = localData[activeSetIndex];
  const currentImgData = set.images[activeImgIndex];

  document.getElementById("lightboxMainImg").src = currentImgData.src;

  
  const mobileCaption = document.getElementById("mobileAltCaption");
  if (mobileCaption) {
    mobileCaption.textContent = currentImgData.alt;
  }
  
  // 1. Render Alt Texts (Logic remains same)
  const altContainer = document.getElementById("altTextContainer");
  altContainer.innerHTML = "";
  set.images.forEach((img, index) => {
    const p = document.createElement("p");
    p.textContent = img.alt;
    p.className = `alt-text-item ${index === activeImgIndex ? 'active' : ''}`;
    p.onclick = () => { activeImgIndex = index; renderLightboxContent(); };
    altContainer.appendChild(p);
  });

  // 2. Render & Auto-Scroll Thumbnails
  const thumbContainer = document.getElementById("thumbnailContainer");
  thumbContainer.innerHTML = "";
  
  set.images.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.className = `thumb-item ${index === activeImgIndex ? 'active' : ''}`;
    
    // Add Click listener
    thumb.onclick = () => { 
      activeImgIndex = index; 
      renderLightboxContent(); 
    };

    thumbContainer.appendChild(thumb);

    // AUTO-SCROLL LOGIC:
    // If this is the active thumbnail, center it in the track
    if (index === activeImgIndex) {
      setTimeout(() => {
        thumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center' // This keeps it in the middle of the "Stage"
        });
      }, 50);
    }
  });

}

function navigate(direction) {
  const set = localData[activeSetIndex];
  if (direction === "next") {
    activeImgIndex = (activeImgIndex + 1) % set.images.length;
  } else {
    activeImgIndex = (activeImgIndex - 1 + set.images.length) % set.images.length;
  }
  renderLightboxContent();
}

function setupEventListeners() {
  const lightbox = document.getElementById("lightbox");
  
  // Close logic
  document.querySelector(".close-btn").onclick = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  };

  // Hitbox navigation
  document.querySelectorAll(".nav-hitbox").forEach(box => {
    box.onclick = (e) => {
      e.stopPropagation();
      navigate(box.dataset.nav);
    };
  });


  const imgContainer = document.querySelector(".lightbox-left");

  // 1. Close Button & Backdrop Logic


  // 2. Desktop Hitbox Clicking (Left/Right side of image)
  document.querySelectorAll(".nav-hitbox").forEach(box => {
    box.onclick = (e) => {
      e.stopPropagation();
      navigate(box.dataset.nav);
    };
  });

  // 3. Mobile Swipe Gestures
  imgContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  imgContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const swipeThreshold = 50; // Minimum distance in pixels to trigger a swipe
  
  if (touchEndX < touchStartX - swipeThreshold) {
    navigate('next'); // Swiped left -> Show next
  } 
  if (touchEndX > touchStartX + swipeThreshold) {
    navigate('prev'); // Swiped right -> Show previous
  }
}

// Helper to clean up when closing
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("active");
  document.body.style.overflow = "auto";
}