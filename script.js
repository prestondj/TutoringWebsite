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

  window.accessibleMode = getAccessibleMode();
  applyAccessibilityUI();

  btn.addEventListener("click", () => {
    window.accessibleMode = !window.accessibleMode;

    setAccessibleMode(window.accessibleMode);
    applyAccessibilityUI();
    applyAccessibilityMode();

    console.log("Accessible mode:", window.accessibleMode);
  });
}

function applyAccessibilityMode() {
  const enabled = window.accessibleMode;

  document.body.classList.toggle("accessible-mode", enabled);

  if (enabled) {
    document.body.classList.add("reduce-motion");
  } else {
    document.body.classList.remove("reduce-motion");
  }

  document.documentElement.style.scrollBehavior = enabled ? "auto" : "smooth";
}

/* =========================
   STATE & MOBILE ROUTING HELPERS
========================= */
const STATE_KEY = "pdj_tutoring_state";

function getState() {
  return localStorage.getItem(STATE_KEY);
}

function setState(value) {
  localStorage.setItem(STATE_KEY, value);
}

// Mobile-safe check to see if the user is currently looking at the thank you page
function isThankYouPage() {
  const path = window.location.pathname;
  return path.endsWith("thank-you.html") || path.includes("thank-you");
}

/* =========================
   ROUTING ON LOAD
========================= */
function handlePageStateRouting() {
  const state = getState();

  if (!state) return;

  // First visit after submit → force thank you page
  if (state === "unhandled") {
    if (!isThankYouPage()) {
      window.location.href = "thank-you.html";
    }
    return;
  }

  // handled → normal behaviour (but form locking logic checks this state on submit)
  if (state === "handled") {
    applyFormLockUI(); // Ensure UI state matches across page switches
    return;
  }
}

/* =========================
   FORM SUBMISSION TRACKING
========================= */
function applyFormLockUI() {
  if (!contactForm) return;
  const submitBtn = contactForm.querySelector("button[type='submit']");
  
  if (getState() === "handled") {
    // Visually flag the block on mobile so the user knows it's unclickable
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Form Already Submitted";
      submitBtn.style.opacity = "0.5";
      submitBtn.style.cursor = "not-allowed";
    }
  }
}

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
  if (isThankYouPage()) {
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
    if (window.accessibleMode) {
      heroBg.style.opacity = 1;
      return;
    }

    const scrollY = window.scrollY;
    const opacity = Math.max(1 - scrollY / 1000, 0.25);

    heroBg.style.opacity = opacity;
  });
}

/* =========================
   FADE SYSTEM
========================= */
function updateAnimations() {
  if (window.accessibleMode) {
    fadeElements.forEach(el => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    return;
  }

  const viewportHeight = window.innerHeight;

  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);
    const maxDistance = viewportHeight * 0.8;

    el.style.opacity = Math.max(1 - distance / maxDistance, 0.5);
  });
}

/* =========================
   MOBILE-SAFE APP RUNNER
========================= */
function initApp() {
  finalizeStateIfThankYouPage();
  handlePageStateRouting();
  handleFormSubmitTracking();
  applyFormLockUI(); // Ensure mobile buttons evaluate state instantly
  setupAnchorNavigation();
  setupHeroFade();
  updateAnimations();
  initAccessibilityToggle();
  applyAccessibilityMode();
}

// Fix for Mobile Cache (bfcache): 'pageshow' executes even when hitting back/forward buttons
window.addEventListener("pageshow", function (event) {
  initApp();
});

/* =========================
   EVENTS
========================= */
window.addEventListener("scroll", updateAnimations);
window.addEventListener("resize", updateAnimations);