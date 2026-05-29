/**
 * nRg shUI — Portfolio interactions
 * Vanilla JS only · GitHub Pages ready
 */

(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const yearEl = document.getElementById("year");
  const revealEls = document.querySelectorAll(".reveal");
  const glowTargets = document.querySelectorAll("[data-glow], .glow-hover");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle("navbar--scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove("is-active");
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.add("is-active");
    navLinks.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      if (navLinks.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.1,
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".navbar__links a");

  if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navAnchors.forEach(function (anchor) {
            anchor.classList.toggle("is-active", anchor.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // Cursor-following glow spotlight (pointer devices only)
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canHover && glowTargets.length) {
    function setSpotlight(el, clientX, clientY) {
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", x + "%");
      el.style.setProperty("--spot-y", y + "%");
    }

    glowTargets.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        setSpotlight(el, e.clientX, e.clientY);
      });

      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--spot-x", "50%");
        el.style.setProperty("--spot-y", "50%");
      });
    });
  }
})();
