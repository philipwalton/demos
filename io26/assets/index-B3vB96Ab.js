(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={getMessages:async()=>{let e=await fetch(`api/messages.json`);if(!e.ok)throw Error(`Network response was not ok`);return(await e.json()).map(e=>({...e,timestamp:new Date(e.timestamp)}))}};function t(e){let t=new Date;return e.getDate()===t.getDate()&&e.getMonth()===t.getMonth()&&e.getFullYear()===t.getFullYear()?e.toLocaleTimeString([],{hour:`numeric`,minute:`2-digit`}):e.toLocaleDateString([],{month:`short`,day:`numeric`})}function n(e,n){n.innerHTML=``;let r=document.createDocumentFragment();e.forEach(e=>{let n=document.createElement(`li`);n.className=`email-item SwipeableList-item ${e.isUnread?`unread`:``}`;let i=[200,340,150,45,280,10],a=i[(e.senderName.charCodeAt(0)+e.senderName.charCodeAt(1))%i.length];n.innerHTML=`
      <div class="SwipeableList-track">
        <div class="SwipeableList-content">
          <a href="#/message/${e.id}" class="email-link">
            <div class="email-avatar" style="background-color: hsl(${a}, 60%, 50%);">
              ${e.initial}
            </div>
            <div class="email-content">
              <div class="email-header-row">
                <span class="email-sender">${e.senderName}</span>
                <span class="email-time">${t(e.timestamp)}</span>
              </div>
              <div class="email-subject">${e.subject}</div>
              <div class="email-preview">${e.preview}</div>
            </div>
          </a>
        </div>
      </div>
    `,r.appendChild(n)}),n.appendChild(r)}function r(){let e=document.getElementById(`drawer`),t=document.getElementById(`menu-btn`),n=e.querySelector(`.drawer-scroller`),r=e.querySelector(`.drawer-sheet`);async function i(){e.showPopover(),CSS.supports(`scroll-initial-target`,`nearest`)||(n.scrollTo({left:n.offsetWidth,behavior:`instant`}),await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e)))),n.scrollTo({left:0,behavior:`auto`})}function a(){n.scrollTo({left:n.offsetWidth,behavior:`auto`})}function o(){document.querySelector(`main`).inert=!0,t.setAttribute(`aria-expanded`,`true`),r.focus({focusVisible:!1})}function s(){e.hidePopover(),document.querySelector(`main`).inert=!1,t.setAttribute(`aria-expanded`,`false`)}let c=1/window.innerWidth;new IntersectionObserver(e=>{let t=e.at(-1);t.intersectionRatio<c&&s(),t.intersectionRatio===1&&o()},{root:e,threshold:[c,1]}).observe(r),t.addEventListener(`click`,i),e.addEventListener(`click`,e=>{r.contains(e.target)||a()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&a()}),CSS.supports(`animation-timeline: scroll()`)||n.addEventListener(`scroll`,()=>{let t=1-n.scrollLeft/r.offsetWidth;e.style.setProperty(`--drawer-backdrop`,t)})}var i=new WeakMap,a=new IntersectionObserver(e=>{for(let t of e){let e=t.target;if(t.isIntersecting){let t=i.get(e)??c(e);t.observer.observe(t.content)}else{let t=i.get(e);t&&t.observer.unobserve(t.content)}}}),o=!CSS.supports(`scroll-initial-target`,`nearest`),s=o?new ResizeObserver(e=>{for(let t of e)t.target.scrollLeft=t.target.clientWidth}):null;function c(e){let t=e.querySelector(`.SwipeableList-track`),n=t.querySelector(`.SwipeableList-content`);e.classList.add(`is-initialized`),o&&(t.scrollLeft=t.clientWidth,s.observe(t));let r=.8,c=.2,d={observer:new IntersectionObserver((i,d)=>{let f=i.at(-1),p=f.intersectionRatio,m=f.boundingClientRect.x-f.rootBounds.x>0?`left`:`right`;if(p<c){(m===`left`?l:u)(e,n,m,f),a.unobserve(e),o&&s.unobserve(t),d.disconnect();return}e.classList.toggle(`is-activating`,p<r),f.boundingClientRect.x!==f.rootBounds.x&&(e.dataset.swipeDirection=m)},{root:t,threshold:[c,r]}),content:n};return i.set(e,d),d}async function l(e,t,n,r){await d(e,t,n,r)}async function u(e,t,n,r){await d(e,t,n,r)}async function d(e,t,n,r){let i={duration:300,easing:`ease`,fill:`forwards`},a=r.boundingClientRect,o=a.x-r.rootBounds.x,s=n===`left`?a.width-o:-(o+a.width);e.classList.add(`is-removing`),e.animate([{height:`${a.height}px`},{height:`0px`}],i),t.animate([{translate:`${s}px`}],i),await Promise.allSettled(e.getAnimations({subtree:!0}).map(e=>e.finished)),globalThis.GestureEvent?(e.inert=!0,setTimeout(()=>e.remove(),5e3)):e.remove()}function f(e){for(let t of e.children)t.matches(`.SwipeableList-item`)&&a.observe(t);new MutationObserver(e=>{for(let t of e)for(let e of t.addedNodes)e.nodeType===Node.ELEMENT_NODE&&e.matches(`.SwipeableList-item`)&&a.observe(e)}).observe(e,{childList:!0})}var p=null,m=new WeakMap,h=new Map,g=0,_;async function v(t){if(t.startsWith(`/message/`)){let n=t.replace(`/message/`,``),r=(await e.getMessages()).find(e=>e.id===n);if(r)return{type:`message`,data:r}}return null}function y(){let t=document.createElement(`div`);return t.className=`Stack-view`,t.innerHTML=`
    <div class="Stack-viewContent">
      <div class="app-container">
        <header class="app-header">
          <div class="header-left">
            <button id="menu-btn" class="icon-button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">
              <svg viewBox="0 0 24 24" width="28" height="26" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h1>Inbox</h1>
          </div>
          <div class="header-actions">
            <button class="icon-button" aria-label="Search">
              <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
        </header>

        <main class="inbox-container">
          <ul id="email-list" class="email-list">
            <!-- Emails will be populated here -->
          </ul>
        </main>
      </div>
    </div>
  `,setTimeout(()=>{r();let i=t.querySelector(`#email-list`);i&&(f(i),e.getMessages().then(e=>n(e,i)))},0),t}function b(e){let n=e.data,r=document.createElement(`div`);r.className=`Stack-view`;let i=n.senderName.charCodeAt(0)+n.senderName.charCodeAt(1),a=[200,340,150,45,280,10],o=a[i%a.length];return r.innerHTML=`
    <div class="Stack-viewContent">
      <div class="app-container message-view">
        <header class="app-header">
          <div class="header-left">
            <button class="icon-button back" aria-label="Back">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
          </div>
          <div class="header-actions">
            <button class="icon-button" aria-label="Archive">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
            </button>
            <button class="icon-button" aria-label="Star">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </button>
            <button class="icon-button" aria-label="Reply">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
            </button>
          </div>
        </header>

        <main class="message-content">
          <h2 class="message-subject">${n.subject}</h2>
          <div class="message-sender-row">
            <div class="email-avatar" style="background-color: hsl(${o}, 60%, 50%); width: 2.75rem; height: 2.75rem; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.1rem; margin-right: 1rem; flex-shrink: 0;">
              ${n.initial}
            </div>
            <div class="message-sender-info" style="flex: 1;">
              <div class="email-sender" style="font-weight: 700; font-size: 1rem;">${n.senderName}</div>
              <div class="email-time" style="font-size: 0.75rem; color: var(--text-tertiary);">${t(n.timestamp)}</div>
            </div>
          </div>
          <div class="message-body" style="padding: 1.5rem; color: var(--text-secondary); line-height: 1.5; font-size: 0.95rem;">
            ${n.preview}
            <br/><br/>
            (Full message content would go here.)
          </div>
        </main>
      </div>
    </div>
  `,r}function x(){return location.hash.slice(1)||`/`}function S(e){return e===`/`?`#/`:`#`+e}async function C(e){let t=await v(e);if(!t)return;let n=g+1;history.pushState({depth:n},``,S(e));for(let e of h.keys())e>=n&&h.delete(e);g=n;let r=b(t);_.appendChild(r),h.set(n,{urlPath:e,view:r}),_.scrollBy({left:_.clientWidth,behavior:`auto`})}function w(){let e=g+1;history.pushState({depth:e},``,`#/`),p||(p=y(),_.prepend(p),_.scrollLeft+=_.clientWidth),h.set(e,{urlPath:`/`,view:p}),E(history.state)}function T(){g===0&&h.get(0)?.view!==p?w():history.back()}async function E(e,t){let n=e?.depth??0,r=x(),i=h.get(n)??{view:null};i.urlPath!==r&&(i.urlPath=r,i.view=r===`/`?p:null),h.set(n,i);for(let e=0;e<=n;e++){let t=h.get(e);if(!t||t.view)continue;let n=await v(t.urlPath);if(!n)continue;let r=b(n);_.appendChild(r),t.view=r}g=n;let a=h.get(n)?.view;if(!a)return;let o=[..._.children].indexOf(a),s=Math.round(_.scrollLeft/_.clientWidth);if(s===o)return;let c=o>s,l=Math.abs(o-s)>1,u=t??(c||l?`instant`:`auto`);_.scrollTo({left:o*_.clientWidth,behavior:u})}function D(e){let t=!1;for(let n of[..._.children])if(t){for(let e of h.values())e.view===n&&(e.view=null);n.remove()}else n.toggleAttribute(`inert`,n!==e),n===e&&(t=!0);let n;for(let[t,r]of h)r.view===e&&(n=t);n!==void 0&&n!==g&&history.go(n-g);let r=m.get(e);r?(r.focus({preventScroll:!0,focusVisible:!1}),m.delete(e)):e!==p&&e.querySelector(`.back`)?.focus({preventScroll:!0,focusVisible:!1})}async function O(){if(_=document.querySelector(`.Stack`),_.addEventListener(`scrollsnapchange`,e=>{D(e.snapTargetInline)}),!(`onscrollsnapchange`in HTMLElement.prototype)){let e=new IntersectionObserver(e=>{for(let t of e)t.intersectionRatio===1&&D(t.target)},{root:_,threshold:1});new MutationObserver(t=>{for(let n of t){for(let t of n.addedNodes)t.classList?.contains(`Stack-view`)&&e.observe(t);for(let t of n.removedNodes)t.classList?.contains(`Stack-view`)&&e.unobserve(t)}}).observe(_,{childList:!0});for(let t of _.children)e.observe(t)}_.addEventListener(`click`,async e=>{if(e.target.closest(`.back`)){T();return}let t=e.target.closest(`a`);if(!t||!_.contains(t)||e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0)return;let n=new URL(t.href).hash.slice(1),r=t.closest(`.Stack-view`);n.startsWith(`/message/`)&&(e.preventDefault(),!(!await v(n)||!r)&&(m.set(r,t),C(n)))}),window.addEventListener(`popstate`,e=>{E(e.state)});let t=x(),r=await v(t),i;if(r?i=b(r):(p=y(),i=p),_.appendChild(i),h.set(0,{urlPath:t,view:i}),history.replaceState({depth:0},``),E(history.state,`instant`),CSS.supports(`animation-timeline: view()`)||_.addEventListener(`scroll`,()=>{let e=_.clientWidth;for(let t of _.children){let n=t.offsetLeft-_.scrollLeft,r=Math.min(1,Math.max(0,-n/e)),i=t.querySelector(`.Stack-viewContent`);i.style.transform=`translateX(${r*75}%)`,i.style.filter=`brightness(${1-r*.2})`}}),i===p){let t=document.getElementById(`email-list`);if(t)try{n(await e.getMessages(),t),f(t)}catch(e){console.error(`Failed to load emails:`,e),t.innerHTML=`<li class="error-msg" style="padding: 2rem; text-align: center; color: var(--text-secondary);">Failed to load messages.</li>`}}}async function k(){await O()}k();