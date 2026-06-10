/* =========================
   ELEMENTS
========================= */
const heroBg = document.querySelector(".hero-background");
const fadeElements = document.querySelectorAll(".fade");
const contactForm = document.querySelector("form");

/* =========================
   ACCESSIBILITY MODE
========================= */

const ACCESS_KEY = "pdj_accessible_mode";

function getAccessibleMode() {
  return localStorage.getItem(ACCESS_KEY) === "true";
}

function setAccessibleMode(value) {
  localStorage.setItem(ACCESS_KEY, value ? "true" : "false");
  window.accessibleMode = value;
}

function applyAccessibilityUI() {
  const btn = document.getElementById("accessibilityToggle");
  if (!btn) return;

  if (window.accessibleMode) {
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }
}

function initAccessibilityToggle() {
  const btn = document.getElementById("accessibilityToggle");
  if (!btn) return;

  // initialise state
  window.accessibleMode = getAccessibleMode();
  applyAccessibilityUI();

  btn.addEventListener("click", () => {
    window.accessibleMode = !window.accessibleMode;
    setAccessibleMode(window.accessibleMode);
    applyAccessibilityUI();

    console.log("Accessible mode:", window.accessibleMode);
  });
}

/* =========================
   STATE
========================= */
const STATE_KEY = "pdj_tutoring_state";

/*
States:
- null → no interaction
- "not_submitted"
- "unhandled" → submitted, awaiting thank-you visit
- "handled" → completed flow, block resubmission
*/

function getState() {
  return localStorage.getItem(STATE_KEY);
}

function setState(value) {
  localStorage.setItem(STATE_KEY, value);
}

/* =========================
   ROUTING ON LOAD
========================= */
function handlePageStateRouting() {
  const state = getState();

  if (!state) return;

  // First visit after submit → force thank you page
  if (state === "unhandled") {
    if (!window.location.pathname.includes("thank-you.html")) {
      window.location.href = "thank-you.html";
    }
    return;
  }

  // handled → normal behaviour
  if (state === "handled") {
    return;
  }
}

/* =========================
   FORM SUBMISSION TRACKING
========================= */
function handleFormSubmitTracking() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (event) {
    const state = getState();

    // BLOCK RESUBMISSION AFTER COMPLETION
    if (state === "handled") {
      event.preventDefault();
      alert("You have already submitted this form.");
      return;
    }

    // mark as submitted (before Formspree sends)
    setState("unhandled");
  });
}

/* =========================
   THANK YOU FINALISATION
========================= */
function finalizeStateIfThankYouPage() {
  if (window.location.pathname.includes("thank-you.html")) {
    const state = getState();

    if (state === "unhandled") {
      setState("handled");
    }
  }
}

/* =========================
   SMOOTH SCROLL
========================= */
function scrollToCenter(element) {
  const rect = element.getBoundingClientRect();
  const absoluteY = rect.top + window.scrollY;
  const offset = (window.innerHeight - rect.height) / 2;

  window.scrollTo({
    top: absoluteY - offset,
    behavior: "smooth"
  });
}

/* =========================
   NAVIGATION
========================= */
function setupAnchorNavigation() {
  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) scrollToCenter(target);
    });
  });
}

/* =========================
   HERO FADE
========================= */
function setupHeroFade() {
  window.addEventListener("scroll", function () {
    if (!heroBg) return;

    const scrollY = window.scrollY;
    const opacity = Math.max(1 - scrollY / 1000, 0.25);

    heroBg.style.opacity = opacity;
  });
}

/* =========================
   FADE SYSTEM
========================= */
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

/* =========================
   INIT
========================= */
window.addEventListener("DOMContentLoaded", function () {
  finalizeStateIfThankYouPage();
  handlePageStateRouting();
  handleFormSubmitTracking();
  setupAnchorNavigation();
  setupHeroFade();
  updateAnimations();

  initAccessibilityToggle();
});

/* =========================
   EVENTS
========================= */
window.addEventListener("scroll", updateAnimations);
window.addEventListener("resize", updateAnimations);