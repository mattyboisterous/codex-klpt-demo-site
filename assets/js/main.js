const themeStorageKey = "klpt-site-theme";

const navigation = [
  { id: "home", label: "Home", href: "index.html" },
  {
    id: "foundations",
    label: "Foundations",
    href: "foundations.html",
    children: [
      { label: "Quality Observations", href: "foundations.html#quality-observations" },
      { label: "Analysing Data", href: "foundations.html#analysing-data" },
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
        <span class="brand__mark">KLPT</span>
        <span class="brand__text">Learning in motion</span>
      </a>

      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="nav-toggle__line"></span>
        <span class="nav-toggle__line"></span>
        <span class="nav-toggle__line"></span>
        <span class="sr-only">Toggle navigation</span>
      </button>

      <div class="nav-panel" id="site-nav">
        <ul class="nav-list">
          ${navItems}
        </ul>
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
          <p>Compare playful, corporate, and editorial directions while keeping the same content architecture.</p>
        </div>
      </div>
    </div>
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
  const storedTheme = window.localStorage.getItem(themeStorageKey) || "sunrise";

  document.body.dataset.theme = storedTheme;

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

mountComponents();
initThemeSelect();
initNavigation();
