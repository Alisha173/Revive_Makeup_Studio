export default async function loadPackages() {
  const packagesGrid = document.getElementById("packagesGrid");
  const filterButtons = document.querySelectorAll(".pkg-filter-btn");

  if (!packagesGrid || !filterButtons.length) {
    console.warn("Packages DOM not found");
    return;
  }

  const footerBtn = document.querySelector(".btn-callback");
  if (footerBtn) {
    footerBtn.addEventListener("click", () => {
      callbackPackageSelector.value="";
      window.location.hash = "#callback";
    });
  }

  try {
    const res = await fetch("data/packages.json");
    if (!res.ok) throw new Error("Failed to load packages data");

    const packagesData = await res.json();
    
    // Initialize with the first category (bridal)
    updateCategoryView("bridal", packagesData);
    initPkgFilters(filterButtons, packagesData);

  } catch (err) {
    console.error(err);
    packagesGrid.innerHTML = "<p>Packages unavailable at the moment.</p>";
  }
}

function initPkgFilters(filterButtons, data) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active state on buttons
      filterButtons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      // Render new category
      updateCategoryView(filter, data);
    });
  });
}

function updateCategoryView(categoryKey, data) {
  const categoryData = data[categoryKey];
  if (!categoryData) return;

  const categoryIcons = {
    bridal: "♕",
    party: "✨",
    professional: "👥"
  };

  // 1️⃣ Target the content container and toggle the compact class
  const contentBox = document.querySelector(".packages-content");
  if (categoryKey === "party" || categoryKey === "professional") {
    contentBox.classList.add("compact-view");
  } else {
    contentBox.classList.remove("compact-view");
  }

  // Update text and icon
  document.getElementById("categoryIcon").textContent = categoryIcons[categoryKey];
  document.getElementById("categoryTitle").textContent = categoryData.title;
  document.getElementById("categoryDesc").textContent = categoryData.description;

  // Render cards
  renderPackages(categoryData.packages);
}

function renderPackages(packages) {
  const packagesGrid = document.getElementById("packagesGrid");
  const template = document.querySelector("#package-card-template");
  const callbackPackageSelector = document.getElementById("packages");
  
  packagesGrid.innerHTML = ""; // Clear existing cards

  packages.forEach(pkg => {
    const clone = template.content.cloneNode(true);
    const cardDiv = clone.querySelector(".package-card");
    
    // Handle the "Popular" highlight styling
    if (pkg.isPopular) {
      cardDiv.classList.add("popular");
      clone.querySelector(".popular-badge").classList.remove("hidden");
    }

    clone.querySelector(".package-name").textContent = pkg.name;
    clone.querySelector(".package-target").textContent = pkg.target;
    clone.querySelector(".package-price").textContent = pkg.price;
    clone.querySelector(".package-price-original").textContent = pkg.originalPrice;
    clone.querySelector(".package-offer").textContent = pkg.offer;

    // Inject the checklist features
    const featuresList = clone.querySelector(".package-features");
    pkg.features.forEach(feature => {
      const li = document.createElement("li");
      li.innerHTML = `${feature}`;
      featuresList.appendChild(li);
    });

    const bookBtn = clone.querySelector(".btn-book-now");
    bookBtn.addEventListener("click", () => {
      callbackPackageSelector.value = pkg.name;
      window.location.hash = "#callback";
    });

    packagesGrid.appendChild(clone);
  });
}