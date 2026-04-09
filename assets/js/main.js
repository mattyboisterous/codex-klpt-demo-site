const themeStorageKey = "klpt-site-theme";
const colorModeStorageKey = "klpt-site-color-mode";

function normalizeTheme(theme) {
  return theme === "editorial" ? "coastal" : theme;
}

const navigation = [
  { id: "home", label: "Home", href: "index.html" },
  {
    id: "foundations",
    label: "Foundations",
    href: "foundations.html",
    children: [
      { label: "Quality Observations", href: "quality-observations.html" },
      { label: "Analysing Data", href: "analysing-data.html" },
    ],
  },
  {
    id: "learning-domains",
    label: "Learning Domains",
    href: "learning-domains.html",
    children: [
      { label: "Language & Literacy", href: "language-literacy.html" },
      { label: "Executive Function", href: "executive-function.html" },
      { label: "Social & Emotional Learning", href: "social-emotional-learning.html" },
      { label: "Physicality", href: "physicality.html" },
      { label: "Mathematics & Numeracy", href: "mathematics-numeracy.html" },
    ],
  },
  { id: "tool", label: "Tool", href: "tool.html" },
  { id: "about", label: "About", href: "about.html" },
];

const footerLinks = [
  { label: "Home", href: "index.html" },
  { label: "Foundations", href: "foundations.html" },
  { label: "Learning Domains", href: "learning-domains.html" },
  { label: "Language & Literacy", href: "language-literacy.html" },
  { label: "Executive Function", href: "executive-function.html" },
  { label: "Social & Emotional Learning", href: "social-emotional-learning.html" },
  { label: "Physicality", href: "physicality.html" },
  { label: "Mathematics & Numeracy", href: "mathematics-numeracy.html" },
  { label: "Tool", href: "tool.html" },
  { label: "About", href: "about.html" },
];

function renderHeader(currentPage) {
  const navItems = navigation
    .map((item) => {
      const isCurrent = item.id === currentPage;

      if (item.children) {
        const submenu = item.children
          .map((child) => `<li><a href="${child.href}">${child.label}</a></li>`)
          .join("");

        return `
          <li class="nav-item--has-submenu${isCurrent ? " is-current-page" : ""}">
            <a class="${isCurrent ? "is-current" : ""}" href="${item.href}">${item.label}</a>
            <ul class="submenu">
              ${submenu}
            </ul>
          </li>
        `;
      }

      return `<li><a class="${isCurrent ? "is-current" : ""}" href="${item.href}">${item.label}</a></li>`;
    })
    .join("");

  return `
    <nav class="topbar" aria-label="Primary">
      <a class="brand" href="index.html">
        <span class="brand__mark">
          <img src="assets/img/klpt-logo.png" alt="KLPT logo" />
        </span>
        <span class="brand__text">Learning in motion</span>
      </a>

      <div class="nav-cluster">
        <div class="nav-panel" id="site-nav">
          <ul class="nav-list">
            ${navItems}
          </ul>
        </div>

        <div class="nav-utilities">
          <button
            class="mode-toggle"
            type="button"
            aria-pressed="false"
            aria-label="Switch to dark mode"
          >
            <span class="mode-toggle__icon" aria-hidden="true">◐</span>
            <span class="mode-toggle__label">Dark mode</span>
          </button>

          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
            <span class="nav-toggle__line"></span>
            <span class="nav-toggle__line"></span>
            <span class="nav-toggle__line"></span>
            <span class="sr-only">Toggle navigation</span>
          </button>
        </div>
      </div>
    </nav>
  `;
}

function renderFooter() {
  const links = footerLinks
    .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
    .join("");

  return `
    <div class="site-footer__inner">
      <div>
        <p class="eyebrow">KLPT Site Concept</p>
        <h2>Built as a flexible static content site with room for demos, resources, and video-rich learning pathways.</h2>
      </div>
      <div class="site-footer__meta">
        <div>
          <strong>Navigate</strong>
          <ul class="site-footer__links">
            ${links}
          </ul>
        </div>
        <div>
          <strong>Use the style switcher</strong>
          <p>Compare playful, corporate, and coastal directions while keeping the same content architecture.</p>
        </div>
      </div>
    </div>
    <button class="back-to-top" type="button" aria-label="Back to top">
      <span class="back-to-top__icon" aria-hidden="true">↑</span>
    </button>
  `;
}

function mountComponents() {
  const currentPage = document.body.dataset.page || "home";
  const headerRoot = document.querySelector('[data-component="header"]');
  const footerRoot = document.querySelector('[data-component="footer"]');

  if (headerRoot) {
    headerRoot.innerHTML = renderHeader(currentPage);
  }

  if (footerRoot) {
    footerRoot.innerHTML = renderFooter();
  }
}

function initThemeSelect() {
  const themeSelect = document.querySelector("#theme-select");
  const storedTheme = normalizeTheme(window.localStorage.getItem(themeStorageKey) || "sunrise");

  document.body.dataset.theme = storedTheme;
  window.localStorage.setItem(themeStorageKey, storedTheme);

  if (!themeSelect) {
    return;
  }

  themeSelect.value = storedTheme;
  themeSelect.addEventListener("change", (event) => {
    const nextTheme = event.target.value;
    document.body.dataset.theme = nextTheme;
    window.localStorage.setItem(themeStorageKey, nextTheme);
  });
}

function initColorModeToggle() {
  const modeToggle = document.querySelector(".mode-toggle");
  const storedMode = window.localStorage.getItem(colorModeStorageKey);
  const preferredMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const activeMode = storedMode || preferredMode;

  function applyColorMode(mode) {
    const isDark = mode === "dark";
    const icon = modeToggle?.querySelector(".mode-toggle__icon");
    const label = modeToggle?.querySelector(".mode-toggle__label");

    document.body.dataset.colorMode = mode;

    if (modeToggle) {
      modeToggle.setAttribute("aria-pressed", String(isDark));
      modeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    if (icon) {
      icon.textContent = isDark ? "◑" : "◐";
    }

    if (label) {
      label.textContent = isDark ? "Light mode" : "Dark mode";
    }
  }

  applyColorMode(activeMode);

  if (!modeToggle) {
    return;
  }

  modeToggle.addEventListener("click", () => {
    const currentMode = document.body.dataset.colorMode === "dark" ? "dark" : "light";
    const nextMode = currentMode === "dark" ? "light" : "dark";
    applyColorMode(nextMode);
    window.localStorage.setItem(colorModeStorageKey, nextMode);
  });
}

function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.querySelector(".nav-panel");
  const submenuItems = document.querySelectorAll(".nav-item--has-submenu");
  const allLinks = document.querySelectorAll(".nav-list a");

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navPanel.classList.toggle("is-open");
    });
  }

  submenuItems.forEach((item) => {
    const link = item.querySelector(":scope > a");

    if (!link) {
      return;
    }

    link.addEventListener("click", (event) => {
      const isMobile = window.matchMedia("(max-width: 980px)").matches;

      if (!isMobile) {
        return;
      }

      const submenuTarget = link.getAttribute("href");
      const onParentPage = window.location.pathname.endsWith(submenuTarget);

      if (!onParentPage) {
        return;
      }

      event.preventDefault();
      item.classList.toggle("is-open");
    });
  });

  allLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navPanel?.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");

      submenuItems.forEach((item) => {
        item.classList.remove("is-open");
      });
    });
  });
}

function initBackToTop() {
  const backToTopButton = document.querySelector(".back-to-top");

  if (!backToTopButton) {
    return;
  }

  function syncBackToTopVisibility() {
    const isVisible = window.scrollY > 280;
    backToTopButton.classList.toggle("is-visible", isVisible);
  }

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", syncBackToTopVisibility, { passive: true });
  syncBackToTopVisibility();
}

mountComponents();
initColorModeToggle();
initThemeSelect();
initNavigation();
initBackToTop();
