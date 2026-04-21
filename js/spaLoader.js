async function loadSection(path, initFn) {
  const app = document.getElementById("app");
  
  try {
    // 1. Cloak the app container immediately
    app.classList.add("loading");

    const res = await fetch(path);
    if (!res.ok) throw new Error("Section load failed");

    const html = await res.text();
    
    // 2. Inject the HTML
    app.innerHTML = html;

    // 3. Reset scroll while hidden
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // 4. Run initialization logic (Gallery, Hero, etc.)
    if (typeof initFn === "function") {
      initFn();
    }

    /* 5. The Reveal: 
       We use double requestAnimationFrame to ensure the browser has:
       Frame 1: Acknowledged the new DOM.
       Frame 2: Calculated the Layout and CSSOM.
    */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        app.classList.remove("loading");
      });
    });

  } catch (err) {
    console.error(err);
    app.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    app.classList.remove("loading");
  }
}

export default loadSection;