const heroBg = document.querySelector(".hero-background");
const fadeElements = document.querySelectorAll(".fade");

// Smooth scroll to center section
function scrollToCenter(element) {

  const rect = element.getBoundingClientRect();
  const absoluteY = rect.top + window.scrollY;

  const offset = (window.innerHeight - rect.height) / 2;

  window.scrollTo({
    top: absoluteY - offset,
    behavior: "smooth"
  });
}

// ALL internal links (nav + logos)
document.querySelectorAll("a[href^='#']").forEach(link => {

  link.addEventListener("click", (e) => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      scrollToCenter(target);
    }
  });
});

// hero fade
window.addEventListener("scroll", () => {

  const scrollY = window.scrollY;
  const opacity = Math.max(1 - scrollY / 1000, 0.25);

  if (heroBg) heroBg.style.opacity = opacity;
});

// fade system
function updateAnimations() {

  const viewportHeight = window.innerHeight;

  fadeElements.forEach(el => {

    const rect = el.getBoundingClientRect();

    const distance = Math.abs(
      rect.top + rect.height / 2 - viewportHeight / 2
    );

    const maxDistance = viewportHeight * 0.8;

    el.style.opacity = Math.max(1 - distance / maxDistance, 0.5);
  });
}

window.addEventListener("scroll", updateAnimations);
window.addEventListener("resize", updateAnimations);

updateAnimations();