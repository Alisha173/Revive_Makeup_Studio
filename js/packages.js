const icons = {
  bridal: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /><path d="M5 21h14" /></svg>
  `,

  party: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/></svg>
  `,

  professional: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M11.5 20h-6.5a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3" /><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" /></svg>
  `,
};

export default async function loadPackages() {
  initIcons();

  const packagesGrid = document.getElementById("packagesGrid");
  const filterButtons = document.querySelectorAll(".pkg-filter-btn");

  if (!packagesGrid || !filterButtons.length) {
    console.warn("Packages DOM not found");
    return;
  }

  const footerBtn = document.querySelector(".btn-callback");
  if (footerBtn) {
    footerBtn.addEventListener("click", () => {
      // Clear any previously saved package so the dropdown remains default
      sessionStorage.removeItem("selectedPackage");
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

function initIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const iconName = el.dataset.icon;
    if (icons[iconName]) {
      el.innerHTML = icons[iconName];
    }
  });
}

function initPkgFilters(filterButtons, data) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active state on buttons
      filterButtons.forEach((b) => {
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

  const contentBox = document.querySelector(".packages-content");
  if (categoryKey === "party" || categoryKey === "professional") {
    contentBox.classList.add("compact-view");
  } else {
    contentBox.classList.remove("compact-view");
  }

  document.getElementById("categoryIcon").innerHTML = icons[categoryKey];

  document.getElementById("categoryTitle").textContent = categoryData.title;
  document.getElementById("categoryDesc").textContent =
    categoryData.description;

  renderPackages(categoryData.packages);
}

function renderPackages(packages) {
  const packagesGrid = document.getElementById("packagesGrid");
  const template = document.querySelector("#package-card-template");
  const callbackPackageSelector = document.getElementById("packages");

  packagesGrid.innerHTML = ""; // Clear existing cards

  packages.forEach((pkg) => {
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
    clone.querySelector(".package-price-original").textContent =
      pkg.originalPrice;
    clone.querySelector(".package-offer").textContent = pkg.offer
      ? "OFFER"
      : "";

    // Inject the checklist features
    const featuresList = clone.querySelector(".package-features");
    pkg.features.forEach((feature) => {
      const li = document.createElement("li");
      li.innerHTML = `${feature}`;
      featuresList.appendChild(li);
    });

    const toggleBtn = clone.querySelector(".package-toggle");
    toggleBtn.addEventListener("click", () => {
      // Toggle the 'expanded' class on the card itself
      cardDiv.classList.toggle("is-expanded");
      
      // Accessibility: Update aria-expanded if you want to be fancy
      const isExpanded = cardDiv.classList.contains("is-expanded");
      toggleBtn.setAttribute("aria-expanded", isExpanded);
    });

    const bookBtn = clone.querySelector(".btn-book-now");
    bookBtn.addEventListener("click", () => {
      // Save the exact package name to session memory
      sessionStorage.setItem("selectedPackage", pkg.name);
      window.location.hash = "#callback";
    });

    packagesGrid.appendChild(clone);
  });
}
 