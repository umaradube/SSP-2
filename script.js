'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const body = document.body;
const columns = [...document.querySelectorAll('.gallery-column')];
const hero = document.querySelector('.hero');
const motionToggle = document.querySelector('#motion-toggle');
let paused = reducedMotion.matches;
let framePending = false;
function paintScroll() {
  framePending = false;
  body.classList.toggle('scrolled', window.scrollY > 20);
  if (!paused && !reducedMotion.matches && window.innerWidth > 700 && window.scrollY < hero.offsetHeight + window.innerHeight) {
    const distance = Math.min(window.scrollY, hero.offsetHeight);
    columns.forEach(column => column.style.transform = `translate3d(0,${distance * Number(column.dataset.speed)}px,0)`);
  } else columns.forEach(column => column.style.transform = '');
}
function queueScroll() { if (!framePending) {framePending = true; requestAnimationFrame(paintScroll);} }
window.addEventListener('scroll', queueScroll, {passive: true});
window.addEventListener('resize', queueScroll, {passive: true});
function syncMotion(){
 body.classList.toggle('motion-paused', paused);
 motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
 motionToggle.setAttribute('aria-pressed', String(paused));
 queueScroll();
}
motionToggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
reducedMotion.addEventListener('change', () => {paused = reducedMotion.matches;syncMotion();});
syncMotion();
if ('IntersectionObserver' in window) {
 body.classList.add('js-motion');
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if(entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);}
 }), {threshold: .08});
 document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const menu = document.querySelector('#menu');
const menuButton = document.querySelector('.menu-button');
function closeMenu(){menu.close();menuButton.setAttribute('aria-expanded','false');body.classList.remove('menu-open');}
menuButton.addEventListener('click', () => {
 if(menu.open) {closeMenu();return;}
 menu.show();menuButton.setAttribute('aria-expanded','true');body.classList.add('menu-open');
});
menu.addEventListener('keydown', event => {if(event.key==='Escape'){closeMenu();menuButton.focus();}});
document.addEventListener('keydown', event => {if(event.key==='Escape' && menu.open){closeMenu();menuButton.focus();}});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('click', event => {if(menu.open && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();});
document.querySelector('#enquiry').addEventListener('submit', event => {
 event.preventDefault();
 const data = new FormData(event.currentTarget);
 const message = `Hi Super Sound Studio Pro! My name is ${data.get('name').trim()}.\nI'm interested in: ${data.get('service')}.\n\n${data.get('message').trim()}`;
 const url = `https://wa.me/27630977711?text=${encodeURIComponent(message)}`;
 const link = document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.click();
 const status = document.querySelector('#form-status');
 status.replaceChildren(document.createTextNode('Your enquiry is ready. If WhatsApp did not open, '));
 const fallback = document.createElement('a');fallback.href=url;fallback.target='_blank';fallback.rel='noopener';fallback.textContent='open it here ↗';fallback.style.textDecoration='underline';status.append(fallback);
});
document.querySelector('#year').textContent = new Date().getFullYear();
// Quiet, staggered image changes echo the moving editorial gallery.
let galleryCycle = 0;
setInterval(() => {
 if (paused || reducedMotion.matches || document.hidden || window.scrollY > hero.offsetHeight) return;
 const column = columns[galleryCycle++ % columns.length];
 const items = [...column.querySelectorAll('.gallery-item')];
 if (items.length !== 2) return;
 column.classList.add('changing');
 window.setTimeout(() => {
  if (!paused && !reducedMotion.matches) {
   const firstMarkup = items[0].innerHTML;
   const firstHref = items[0].getAttribute('href');
   items[0].innerHTML = items[1].innerHTML;
   items[0].setAttribute('href', items[1].getAttribute('href'));
   items[1].innerHTML = firstMarkup;
   items[1].setAttribute('href', firstHref);
  }
  column.classList.remove('changing');
 }, 450);
}, 3800);
