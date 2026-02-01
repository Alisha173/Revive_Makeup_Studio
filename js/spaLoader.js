async function loadSection(path, initFn) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Section load failed");

    const html = await res.text();
    document.getElementById("app").innerHTML = html;

    if (typeof initFn === "function") {
      initFn();
    }
  } catch (err) {
    console.error(err);
    document.getElementById("app").innerHTML =
      "<p>Something went wrong. Please try again later.</p>";
  }
}

export default loadSection;
