// lightbox.js

let localData = [];
let activeSetIndex = 0;
let activeImgIndex = 0;

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
  
  // Update Alt Texts
  const altContainer = document.getElementById("altTextContainer");
  altContainer.innerHTML = "";
  set.images.forEach((img, index) => {
    const p = document.createElement("p");
    p.textContent = img.alt;
    p.className = `alt-text-item ${index === activeImgIndex ? 'active' : ''}`;
    p.onclick = () => { activeImgIndex = index; renderLightboxContent(); };
    altContainer.appendChild(p);
  });

  // Update Thumbnails
  const thumbContainer = document.getElementById("thumbnailContainer");
  thumbContainer.innerHTML = "";
  set.images.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.className = `thumb-item ${index === activeImgIndex ? 'active' : ''}`;
    thumb.onclick = () => { activeImgIndex = index; renderLightboxContent(); };
    thumbContainer.appendChild(thumb);
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
}