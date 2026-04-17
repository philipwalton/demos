// DOM element references.
const main = document.querySelector('main');

const drawer = document.getElementById('drawer');
const openDrawerBtn = document.getElementById('drawer-open');

const scroller = drawer.querySelector('.Drawer-scroller');
const sheet = drawer.querySelector('.Drawer-sheet');

async function openDrawer() {
  main.inert = true;
  drawer.inert = false;
  openDrawerBtn.setAttribute('aria-expanded', 'true');

  // Use smooth scrolling for the drawer slide-in effect.
  scroller.scrollTo({left: 0, behavior: 'smooth'});
}

async function closeDrawer() {
  // Use smooth scrolling for the drawer slide-out effect.
  scroller.scrollTo({left: scroller.offsetWidth, behavior: 'smooth'});
}

function onDrawerOpened() {
  // Set focus on the sheet when the drawer finishes opening.
  sheet.focus();
}

function onDrawerClosed() {
  main.inert = false;
  drawer.inert = true;
  openDrawerBtn.setAttribute('aria-expanded', 'false');

  // Reset scroll positions for the next open.
  scroller.scrollTo({left: scroller.offsetWidth});
  sheet.scrollTo(0, 0);
}

function observeButtonClicks() {
  openDrawerBtn.addEventListener('click', () => openDrawer());
}

function observeOpenAndClosedState() {
  const visibleThreshold = 1 / window.innerWidth; // At least 1px on screen.
  const observer = new IntersectionObserver((entries) => {
    const entry = entries.at(-1); // Only the last entry is relevant.
    if (entry.intersectionRatio < visibleThreshold) {
      onDrawerClosed();
    }
    if (entry.intersectionRatio === 1) {
      onDrawerOpened();
    }
  }, {root: drawer, threshold: [visibleThreshold, 1]});
  observer.observe(sheet);
}

function observeLightDismiss() {
  drawer.addEventListener('click', async (event) => {
    if (!sheet.contains(event.target)) {
      closeDrawer();
    }
  });
}

function observeEscKeyDismiss() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDrawer();
    }
  });
}

// OPTIONAL: scroll-driven animation fallback styles to fade the backdrop
// in and out as the drawer opens and closes.
function addScrollAnimationFallback() {
  scroller.addEventListener('scroll', () => {
    const scrollRatio = 1 - scroller.scrollLeft / sheet.offsetWidth;
    scroller.style.setProperty('--drawer-backdrop', scrollRatio);
  });
}

function initDrawer() {
  drawer.dataset.initialized = true;

  // Start with the drawer in the closed state.
  onDrawerClosed();

  // Register observers and event listeners.
  observeButtonClicks();
  observeLightDismiss();
  observeEscKeyDismiss();
  observeOpenAndClosedState();

  // Conditionally add a fallback in the browser doesn't support
  // scroll animations to get the backdrop fade effect while scrolling.
  if (!CSS.supports('animation-timeline: scroll()')) {
    addScrollAnimationFallback();
  }
}

initDrawer();
