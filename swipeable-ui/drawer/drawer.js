// DOM element references.
const drawer = document.querySelector('.Drawer');
const scroller = document.querySelector('.Drawer-scroller');
const sheet = document.querySelector('.Drawer-sheet');
const openDrawerBtn = document.getElementById('drawer-open');

let isOpen = false;

async function openDrawer() {
  drawer.classList.add('Drawer--active');

  // Set initial scroll state, where the sidebar is offscreen.
  scroller.scrollTo({left: scroller.offsetWidth});
  sheet.scrollTo(0, 0);

  // Then smoothly scroll the sidebar into view.
  requestAnimationFrame(() => {
    scroller.scrollTo({left: 0, behavior: 'smooth'});
  });
}

async function closeDrawer() {
  requestAnimationFrame(() => {
    scroller.scrollTo({left: scroller.offsetWidth, behavior: 'smooth'});
  });
}

function handleOpen() {
  openDrawerBtn.addEventListener('click', () => {
    if (!isOpen) {
      openDrawer();
    }
  });
}

function handleSwipeDismiss() {
  const visibleThreshold = 1 / window.innerWidth; // At lest 1px on screen.
  const observer = new IntersectionObserver((entries) => {
    const entry = entries.at(-1); // Only the last entry is relevant.
    if (isOpen && entry.intersectionRatio < visibleThreshold) {
      document.body.style.setProperty('overflow', '');
      drawer.classList.remove('Drawer--active');
      isOpen = false;
    }
    if (entry.intersectionRatio === 1) {
      drawer.focus();
      isOpen = true;
    }
  }, {root: drawer, threshold: [visibleThreshold, 1]});
  observer.observe(sheet);
}

function handleLightDismiss() {
  drawer.addEventListener('click', async (event) => {
    if (isOpen && !sheet.contains(event.target)) {
      closeDrawer();
    }
  });
}

// OPTIONAL: scroll-driven animation fallback styles to fade the backdrop
// in and out as the drawer opens and closes.
function addScrollAnimationFallback() {
  scroller.addEventListener('scroll', (event) => {
    const scrollRatio = 1 - scroller.scrollLeft / sheet.offsetWidth;
    sheet.style.setProperty('--backdrop', scrollRatio);
  }, {passive: true});
}

function initDrawer() {
  handleOpen();
  handleSwipeDismiss();
  handleLightDismiss();

  // Conditionally add a fallback in the browser doesn't support
  // scroll animations to get the backdrop fade effect while scrolling.
  if (true || !CSS.supports('animation-timeline: scroll()')) {
    addScrollAnimationFallback();
  }

  // IMPORTANT! This demo does not implement logic to dismiss the sidebar
  // when it loses focus or when pressing the ESC key. These are important
  // behaviors to implement, but they're omitted here to keep things simple.
}

initDrawer();
