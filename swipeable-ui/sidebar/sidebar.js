// DOM element references.
const sidebar = document.querySelector('.Sidebar');
const backdrop = document.querySelector('.Sidebar-backdrop');
const scroller = document.querySelector('.Sidebar-scroller');
const sheet = document.querySelector('.Sidebar-sheet');
const openSidebarBtn = document.getElementById('sidebar-open');

async function animate(entries, duration = 300) {
  return Promise.all(
    entries.map(async ([el, styles]) => {
      const animation = el.animate(styles, {
        easing: 'ease',
        fill: 'forwards',
        duration,
      });

      await animation.finished;
      animation.commitStyles();
      animation.cancel();
    })
  );
}

async function openSidebar() {
  document.body.style.setProperty('overflow', 'hidden');
  sidebar.focus(); // Since Safari doesn't automatically set popover focus.

  await animate([
    [scroller, {'translate': '0%'}],
    [backdrop, {'opacity': '1'}],
  ]);
  sidebar.classList.add('Sidebar--active');
}

async function closeSidebar(duration) {
  if (!sidebar.classList.contains('Sidebar--active')) return;

  document.body.style.setProperty('overflow', '');
  sidebar.classList.remove('Sidebar--active');

  await animate(
    [
      [scroller, {'translate': '-100%'}],
      [backdrop, {'opacity': '0'}],
    ],
    duration
  );

  scroller.scrollTo(0, 0);
  sheet.scrollTo(0, 0);
}

function observePopoverToggle() {
  sidebar.addEventListener('toggle', (event) => {
    if (event.newState === 'open') {
      openSidebar();
    } else {
      closeSidebar();
    }
  });
}

function observeSwipeDismiss() {
  const visibleThreshold = 1 / window.innerWidth; // At lest 1px on screen.
  const observer = new IntersectionObserver(
    async (entries) => {
      const entry = entries.at(-1);
      if (
        entry.intersectionRatio < visibleThreshold &&
        sidebar.classList.contains('Sidebar--active')
      ) {
        await closeSidebar(0);
        sidebar.hidePopover();
      }
    },
    {root: sidebar, threshold: visibleThreshold}
  );
  observer.observe(sheet);
}

function observeFocusoutDismiss() {
  sidebar.addEventListener('focusout', async (event) => {
    if (
      sidebar.matches(':popover-open') &&
      !sidebar.contains(event.relatedTarget)
    ) {
      await closeSidebar();
      sidebar.hidePopover();
    }
  });
}

function addScrollAnimationFallback() {
  scroller.addEventListener('scroll', (event) => {
    const scrollRatio = 1 - scroller.scrollLeft / scroller.offsetWidth;
    if (sidebar.classList.contains('Sidebar--active')) {
      backdrop.style.setProperty('opacity', scrollRatio);
    }
  });
}

function initSidebar() {
  observePopoverToggle();
  observeSwipeDismiss();
  observeFocusoutDismiss();

  // Conditionally add a fallback in the browser doesn't support
  // scroll animations to get the backdrop fade effect while scrolling.
  if (!CSS.supports('animation-timeline: scroll()')) {
    addScrollAnimationFallback();
  }
}

initSidebar();
