// DOM element references.
const app = document.querySelector('.App');
const sidebar = document.querySelector('.App-sidebar');
const main = document.querySelector('.App-main');

const openSidebarBtn = document.getElementById('sidebar-open');
let isOpen = false;


function openSidebar() {
  app.classList.add('App--active');
  main.scrollIntoView();
  sidebar.scrollIntoView({behavior: 'smooth'});
}

function closeSidebar(event) {
  main.scrollIntoView({behavior: 'smooth'});
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
        main.removeAttribute('style');
        app.classList.remove('App--active');
        isOpen = false;
      }
      if (entry.intersectionRatio === 1) {
        sidebar.focus();
        isOpen = true;
      }
    },
    {root: app, threshold: [visibleThreshold, 1]}
  );
  observer.observe(sidebar);
}

function handleFocusoutDismiss() {
  sidebar.addEventListener('focusout', async (event) => {
    if (isOpen && !sidebar.contains(event.relatedTarget)) {
      closeSidebar();
    }
  });
}

function handleLightDismiss() {
  app.addEventListener('click', async (event) => {
    if (isOpen && !sidebar.contains(event.target)) {
      closeSidebar();
    }
  });
}

function handleEscDismiss() {
  sidebar.addEventListener('keydown', async (event) => {
    if (isOpen && event.key === 'Escape') {
      closeSidebar();
    }
  });
}

function addScrollAnimationFallback() {
  app.addEventListener('scroll', (event) => {
    const scrollRatio = app.scrollLeft / sidebar.offsetWidth;
    main.style.setProperty('opacity', 0.5 + scrollRatio / 2);
    main.style.setProperty('box-shadow', `inset 0 -2em 2em rgba(0,0,0,${0.5 - scrollRatio / 2})`);
  }, {passive: true});
}

function initSidebar() {
  handleSidebarToggle();
  handleSwipeDismiss();

  // The following are not required to make the demo work, but they're
  // good things to support in general when building a sidebar.
  handleLightDismiss();
  // handleEscDismiss();
  // handleFocusoutDismiss();

  // Conditionally add a fallback in the browser doesn't support
  // scroll animations to get the backdrop fade effect while scrolling.
  if ( true || !CSS.supports('animation-timeline: scroll()')) {
    addScrollAnimationFallback();
  }
}

initSidebar();
