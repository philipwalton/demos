// DOM element references.
const app = document.querySelector('.App');
const sidebar = document.querySelector('.App-sidebar');
const main = document.querySelector('.App-main');

const openSidebarBtn = document.getElementById('sidebar-open');
let isOpen = false;


async function openSidebar() {
  app.classList.add('App--open');

  if (!CSS.supports('scroll-initial-target', 'nearest')) {
    app.scrollTo({left: sidebar.offsetWidth, behavior: 'instant'});
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }

  app.scrollTo({left: 0, behavior: 'auto'});
}

function closeSidebar(event) {
  app.scrollTo({left: sidebar.offsetWidth, behavior: 'auto'});
}

function handleSidebarToggle() {
  openSidebarBtn.addEventListener('click', () => {
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

function handleSwipeDismiss() {
  const visibleThreshold = 1 / window.innerWidth; // At lest 1px on screen.
  const observer = new IntersectionObserver(
    async (entries) => {
      const entry = entries.at(-1);
      if (isOpen && entry.intersectionRatio < visibleThreshold) {
        sidebar.scrollTo(0, 0);
        app.style.removeProperty('--scroll-progress');
        app.classList.remove('App--open');
        main.inert = false;
        openSidebarBtn.setAttribute('aria-expanded', 'false');
        isOpen = false;
      }
      if (entry.intersectionRatio === 1) {
        main.inert = true;
        openSidebarBtn.setAttribute('aria-expanded', 'true');
        isOpen = true;
      }
    },
    {root: app, threshold: [visibleThreshold, 1]}
  );
  observer.observe(sidebar);
}

function handleLightDismiss() {
  app.addEventListener('click', (event) => {
    if (isOpen && !sidebar.contains(event.target)) {
      closeSidebar();
    }
  });
}

function handleEscDismiss() {
  document.addEventListener('keydown', (event) => {
    if (isOpen && event.key === 'Escape') {
      closeSidebar();
    }
  });
}

function addScrollAnimationFallback() {
  app.addEventListener('scroll', (event) => {
    app.style.setProperty('--scroll-progress', app.scrollLeft / sidebar.offsetWidth);
  });
}

function initSidebar() {
  handleSidebarToggle();
  handleSwipeDismiss();
  handleLightDismiss();
  handleEscDismiss();

  // Conditionally add a fallback in the browser doesn't support
  // scroll animations to get the backdrop fade effect while scrolling.
  if (!CSS.supports('animation-timeline: scroll()')) {
    addScrollAnimationFallback();
  }
}

initSidebar();
