/**
 * yugshetty.com — Main JavaScript
 * Theme switching, mobile nav, active links, article filters
 */
(function () {
  "use strict";

  // ========================================
  // THEME MANAGEMENT
  // ========================================
  var THEME_KEY = "yugshetty-theme";
  var themeToggle = document.getElementById("theme-toggle");
  var htmlEl = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // localStorage unavailable — fail silently
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored || getSystemTheme();
    htmlEl.setAttribute("data-theme", theme);
  }

  // Initialize immediately
  initTheme();

  // Toggle click
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = htmlEl.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // React to system preference changes (only when no stored preference)
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {
      if (!getStoredTheme()) {
        htmlEl.setAttribute("data-theme", e.matches ? "dark" : "light");
      }
    });

  // ========================================
  // MOBILE NAVIGATION
  // ========================================
  var navToggle = document.getElementById("nav-toggle");
  var navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on nav link click
    var navLinks = navMenu.querySelectorAll(".nav-link");
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    }

    // Close menu on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  // ========================================
  // ACTIVE NAV LINK
  // ========================================
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  var allNavLinks = document.querySelectorAll(".nav-link");
  for (var j = 0; j < allNavLinks.length; j++) {
    var href = allNavLinks[j].getAttribute("href");
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html")
    ) {
      allNavLinks[j].classList.add("active");
    }
  }

  // ========================================
  // FILTER TAGS (Articles page)
  // ========================================
  var filterTags = document.querySelectorAll(".filter-tag");
  if (filterTags.length > 0) {
    for (var k = 0; k < filterTags.length; k++) {
      filterTags[k].addEventListener("click", function () {
        // Update active state
        for (var m = 0; m < filterTags.length; m++) {
          filterTags[m].classList.remove("active");
        }
        this.classList.add("active");

        // Filter articles by data-category
        var filter = this.getAttribute("data-filter");
        var articles = document.querySelectorAll(".article-item[data-category]");
        for (var n = 0; n < articles.length; n++) {
          if (
            filter === "all" ||
            articles[n].getAttribute("data-category") === filter
          ) {
            articles[n].style.display = "";
          } else {
            articles[n].style.display = "none";
          }
        }
      });
    }
  }
})();
