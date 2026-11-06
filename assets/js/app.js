const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const savedTheme=localStorage.getItem('mf-theme')||'light';document.body.classList.toggle('dark',savedTheme==='dark');
function setTheme(){document.body.classList.toggle('dark');localStorage.setItem('mf-theme',document.body.classList.contains('dark')?'dark':'light')}
function setDir(){const d=document.documentElement.dir==='rtl'?'ltr':'rtl';document.documentElement.dir=d;localStorage.setItem('mf-dir',d)}
const dir=localStorage.getItem('mf-dir');if(dir)document.documentElement.dir=dir;
$$('[data-theme]').forEach(b=>b.addEventListener('click',setTheme));$$('[data-dir]').forEach(b=>b.addEventListener('click',setDir));
// Highlight the current page in both desktop and mobile navigation.
const currentFile=(location.pathname.split('/').pop()||'index.html').toLowerCase();
$$('.navlinks a, .mobile-menu a').forEach(link=>{
 const target=(link.getAttribute('href')||'').split('#')[0].toLowerCase();
 const active=(target===currentFile);
 link.classList.toggle('active',active);
 if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
});
const ham=$('.hamb'),mobile=$('.mobile-menu');if(ham&&mobile){ham.addEventListener('click',(e)=>{e.stopPropagation();const isOpen=mobile.classList.toggle('open');ham.setAttribute('aria-expanded',isOpen);ham.textContent=isOpen?'✕':'☰'});document.addEventListener('click',(e)=>{if(!mobile.contains(e.target)&&!ham.contains(e.target)&&mobile.classList.contains('open')){mobile.classList.remove('open');ham.setAttribute('aria-expanded','false');ham.textContent='☰'}});$$('a',mobile).forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');ham.setAttribute('aria-expanded','false');ham.textContent='☰'}))}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(el=>observer.observe(el));
function readBookings(){try{return JSON.parse(localStorage.getItem('mf-bookings')||'[]')}catch{return []}}
function saveBooking(data){const all=readBookings();all.unshift({...data,id:'MF'+Date.now().toString().slice(-7),status:'Pending',created:new Date().toLocaleDateString()});localStorage.setItem('mf-bookings',JSON.stringify(all));return all[0]}
$$('[data-booking-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(form));const b=saveBooking(d);const msg=$('[data-form-message]',form)||$('.notice',form);if(msg){msg.textContent=`Request ${b.id} saved. Sign in to view it in your dashboard.`;msg.style.display='block'}form.reset()}));
$$('[data-contact-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const n=$('.notice',form);if(n){n.textContent='Thank you. Your message has been recorded in this demo.';n.style.display='block'}form.reset()}));
// Demo login/signup: local front-end only
const login=$('[data-login-form]');if(login)login.addEventListener('submit',e=>{e.preventDefault();const email=$('#loginEmail').value.trim();localStorage.setItem('mf-user',JSON.stringify({name:email.split('@')[0]||'Customer',email}));location.href='dashboard.html'});
const signup=$('[data-signup-form]');if(signup)signup.addEventListener('submit',e=>{e.preventDefault();if(!$('#terms').checked){alert('Please accept the terms and conditions.');return}const name=$('#fullName').value.trim(),email=$('#signupEmail').value.trim();localStorage.setItem('mf-user',JSON.stringify({name,email}));location.href='dashboard.html'});
$$('[data-social-login]').forEach(b=>b.addEventListener('click',()=>alert('Connect Google or Apple OAuth credentials to enable secure social sign-in.')));
const user=(()=>{try{return JSON.parse(localStorage.getItem('mf-user')||'null')}catch{return null}})();
$$('.dash-user-name').forEach(el=>el.textContent=user?.name||'Guest Customer');
$$('.dash-email').forEach(el=>el.textContent=user?.email||'guest@example.com');
if(user?.name){$$('.avatar').forEach(a=>a.textContent=(user.name.slice(0,2)).toUpperCase())}
const list=$('[data-booking-list]');if(list){const bookings=readBookings();if(bookings.length){list.innerHTML=bookings.slice(0,6).map(b=>`<div class="booking-row"><div><strong>${escapeHtml(b.vehicle||'Vehicle booking')} · ${escapeHtml(b.from||'Pickup')} → ${escapeHtml(b.to||'Drop')}</strong><small>${escapeHtml(b.date||b.created||'')} · ${escapeHtml(b.id)}</small></div><span class="status">${escapeHtml(b.status)}</span></div>`).join('')}else list.innerHTML='<p class="empty">No bookings yet. Create your first booking to see it here.</p>'}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const side=$('.sidebar');
if(side){
  const toggleSide=(e)=>{
    if(e){e.preventDefault();e.stopPropagation()}
    const isOpen=side.classList.toggle('open');
    $$('[data-sidebar-toggle]').forEach(b=>b.setAttribute('aria-expanded',String(isOpen)));
  };
  $$('[data-sidebar-toggle]').forEach(b=>{b.onclick=toggleSide});
  document.addEventListener('click',e=>{
    if(side.classList.contains('open')&&!side.contains(e.target)&&!e.target.closest('[data-sidebar-toggle]')){
      side.classList.remove('open');
      $$('[data-sidebar-toggle]').forEach(b=>b.setAttribute('aria-expanded','false'));
    }
  });
}
$$('[data-logout]').forEach(b=>b.addEventListener('click',()=>{localStorage.removeItem('mf-user');location.href='login.html'}));

// Floating Back to Top icon button (visible on all sections when scrolling)
(()=>{
  let btn = $('.back-to-top');
  if(!btn){
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(btn);
  }

  const getScroll = () => {
    const d = $('.dash-main');
    const winY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const dashY = d ? d.scrollTop : 0;
    return Math.max(winY, dashY);
  };

  const onScroll = () => {
    btn.classList.toggle('visible', getScroll() > 160);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  const dm = $('.dash-main');
  if(dm) dm.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const goTop = () => {
    const d = $('.dash-main');
    if(d && d.scrollTop > 0) d.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  btn.addEventListener('click', goTop);
})();

// Unique 3D Tilt & Interactive Spotlight Glare on Vehicle Cards
(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards=$$('.visual-card, .vehicle-card');
  cards.forEach(card=>{
    let rect=null;
    card.addEventListener('mouseenter',()=>{rect=card.getBoundingClientRect()});
    card.addEventListener('mousemove',e=>{
      if(!rect) rect=card.getBoundingClientRect();
      const x=e.clientX-rect.left;
      const y=e.clientY-rect.top;
      const xPct=Math.max(0,Math.min(100,(x/rect.width)*100));
      const yPct=Math.max(0,Math.min(100,(y/rect.height)*100));
      const rotX=((y-rect.height/2)/(rect.height/2))*-7;
      const rotY=((x-rect.width/2)/(rect.width/2))*7;

      card.style.setProperty('--mouse-x',`${xPct.toFixed(1)}%`);
      card.style.setProperty('--mouse-y',`${yPct.toFixed(1)}%`);
      card.style.transform=`perspective(850px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave',()=>{
      rect=null;
      card.style.transform='';
    });
  });

  // Home 1 Testimonial Filter Chips
  const filterChips = document.querySelectorAll('.h1-feed-filters .filter-chip');
  if (filterChips.length) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.getAttribute('data-filter');
        const cards = document.querySelectorAll('.h1-story-card');
        cards.forEach(card => {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInCard 0.35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
})();

/* 3D cube-flip CTA buttons */
(function(){
  const sel='.hero-btn,.home2-btn,.btn';
  const flipText={book:'Book in 2 mins \u2192',plan:'Let\u2019s plan it \u2192',explore:'See our fleet \u2192',login:'Get started \u2192'};
  document.querySelectorAll(sel).forEach(btn=>{
    if(btn.querySelector('.cube3d')||btn.hasAttribute('data-theme')||btn.hasAttribute('data-dir')||btn.hasAttribute('data-no-cube')||!btn.textContent.trim())return;
    const cs=getComputedStyle(btn);
    const h=Math.round(btn.getBoundingClientRect().height)||46;
    const label=btn.textContent.trim().replace(/\s+/g,' ');
    const key=Object.keys(flipText).find(k=>label.toLowerCase().includes(k));
    const back=btn.dataset.flip||(key?flipText[key]:(/[\u2192\u203a>]$/.test(label)?label:label+' \u2192'));
    const primary=/primary/.test(btn.className)||cs.backgroundColor.replace(/\s/g,'')==='rgb(255,191,36)';
    btn.style.setProperty('--cube-h',h+'px');
    btn.style.setProperty('--f-bg',cs.backgroundColor);
    btn.style.setProperty('--f-color',cs.color);
    btn.style.setProperty('--f-border',cs.borderTopColor);
    btn.style.setProperty('--b-bg',primary?'#062e55':'#ffbf24');
    btn.style.setProperty('--b-color',primary?'#ffffff':'#062e55');
    const front=document.createElement('span');front.className='cube-face cube-front';
    while(btn.firstChild)front.appendChild(btn.firstChild);
    const bk=document.createElement('span');bk.className='cube-face cube-back';bk.textContent=back;bk.setAttribute('aria-hidden','true');
    const cube=document.createElement('span');cube.className='cube3d';
    cube.appendChild(front);cube.appendChild(bk);
    btn.classList.add('btn-cube');btn.appendChild(cube);
  });
})();

/* Fleet Carousel slider controller */
(function(){
  const track = document.querySelector('[data-fleet-track]');
  if (!track) return;
  const prevBtn = document.querySelector('[data-fleet-prev]');
  const nextBtn = document.querySelector('[data-fleet-next]');
  const dots = document.querySelectorAll('[data-fleet-dots] .dot');
  const cards = track.querySelectorAll('.fleet-slide-card');
  if (!cards.length) return;

  function getStep() {
    const card = cards[0];
    const gap = 24;
    return (card ? card.offsetWidth + gap : 340);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      track.scrollBy({ left: getStep(), behavior: 'smooth' });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      track.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      const idx = parseInt(dot.dataset.index, 10);
      const targetCard = cards[idx];
      if (targetCard) {
        track.scrollTo({ left: targetCard.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      }
    });
  });

  let scrollTimeout;
  track.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      const scrollPos = track.scrollLeft;
      let activeIndex = 0;
      let minDiff = Infinity;
      cards.forEach(function(card, idx) {
        const diff = Math.abs(card.offsetLeft - track.offsetLeft - scrollPos);
        if (diff < minDiff) {
          minDiff = diff;
          activeIndex = idx;
        }
      });
      dots.forEach(function(dot, idx) {
        dot.classList.toggle('active', idx === activeIndex);
      });
    }, 60);
  }, { passive: true });
})();

// Sticky navbar scroll elevation
(()=>{
  const nav = document.querySelector('.navbar');
  if(!nav) return;
  const updateNav = () => {
    if (window.scrollY > 10) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();
