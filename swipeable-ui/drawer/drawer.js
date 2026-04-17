// DOM element references.
const main = document.querySelector('main');

const drawer = document.getElementById('drawer');
const openBtn = document.getElementById('drawer-open');
const scroller = drawer.querySelector('.Drawer-scroller');
const sheet = drawer.querySelector('.Drawer-sheet');

async function openDrawer() {
  // Promote to the top layer before scrolling.
  drawer.showPopover();

  // If the browser doesn't support `scroll-initial-target: nearest` then
  // programmatically scroll the drawer out of view before scrolling it into
  // view. Also wait for a double-rAF before continuing to ensure  `scrollTo()`
  // fully settles before calling `scrollTo()` again below.
  if (!CSS.supports('scroll-initial-target', 'nearest')) {
    scroller.scrollTo({left: scroller.offsetWidth});
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }

  // Finally smooth scroll so the drawer is fully in view.
  scroller.scrollTo({left: 0, behavior: 'smooth'});
}

async function closeDrawer() {
  scroller.scrollTo({left: scroller.offsetWidth, behavior: 'smooth'});
}

function onDrawerOpened() {
  main.inert = true;
  openBtn.setAttribute('aria-expanded', 'true');
  sheet.focus();
}

function onDrawerClosed() {
  drawer.hidePopover();
  main.inert = false;
  openBtn.setAttribute('aria-expanded', 'false');
}

function observeButtonClicks() {
  openBtn.addEventListener('click', () => openDrawer());
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

function observeOpenAndClosedState() {
  const visibleThreshold = 1 / window.innerWidth; // At least 1px on screen.
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries.at(-1); // Only the last entry is relevant.
      if (entry.intersectionRatio < visibleThreshold) {
        onDrawerClosed();
      }
      if (entry.intersectionRatio === 1) {
        onDrawerOpened();
      }
    },
    {root: drawer, threshold: [visibleThreshold, 1]},
  );
  observer.observe(sheet);
}

// OPTIONAL: scroll-driven animation fallback styles to fade the backdrop
// in and out as the drawer opens and closes.
function addScrollAnimationFallback() {
  scroller.addEventListener('scroll', () => {
    const scrollRatio = 1 - scroller.scrollLeft / sheet.offsetWidth;
    drawer.style.setProperty('--drawer-backdrop', scrollRatio);
  });
}

function initDrawer() {
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
