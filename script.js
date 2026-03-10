// ── CURSOR ──
const cur = document.getElementById('cur');
const aura = document.getElementById('cur-aura');
let mx=0, my=0, ax=0, ay=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function loop() {
  ax += (mx-ax) * .1; ay += (my-ay) * .1;
  aura.style.left = ax + 'px'; aura.style.top = ay + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .work-card, .cs-other-card, .stat-item, .about-card, .pill, .filt').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ── PAGE NAVIGATION ──
function showPage(id) {
  document.querySelectorAll('.page, .case-study').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.page === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(runReveal, 100);
  return false;
}

function showCS(id) {
  document.querySelectorAll('.page, .case-study').forEach(el => el.classList.remove('active'));
  document.getElementById('cs-' + id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.page === 'portfolio'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(runReveal, 100);
}

// ── SCROLL REVEAL ──
function runReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}
runReveal();

// ── TEXT ANIMATE on home ──
const words = ['human', 'delightful', 'intuitive', 'meaningful'];
let wi = 0;
const gradWord = document.querySelector('.grad-word');
if (gradWord) {
  setInterval(() => {
    wi = (wi + 1) % words.length;
    gradWord.style.opacity = '0';
    gradWord.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      gradWord.textContent = words[wi];
      gradWord.style.transition = 'opacity .4s ease, transform .4s ease';
      gradWord.style.opacity = '1';
      gradWord.style.transform = 'none';
    }, 300);
  }, 2200);
  gradWord.style.transition = 'opacity .4s ease, transform .4s ease';
}

// ── INTERACTIVE FACT CARDS ──
(function() {
  const cards = [...document.querySelectorAll('.fact-card')];
  const wraps = [...document.querySelectorAll('.fact-wrap')];
  const PROXIMITY = 160;
  const MAX_MOVE  = 30;
  const LERP      = 0.1;

  const state = cards.map(() => ({ tx:0, ty:0, cx:0, cy:0, active:false, raf:null }));

  function getCenter(i) {
    const r = wraps[i].getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function tick(i) {
    const s = state[i], card = cards[i];
    s.cx += (s.tx - s.cx) * LERP;
    s.cy += (s.ty - s.cy) * LERP;
    card.style.transform = `translate(${s.cx.toFixed(2)}px,${s.cy.toFixed(2)}px)`;
    if (Math.abs(s.cx - s.tx) > 0.1 || Math.abs(s.cy - s.ty) > 0.1 || s.active) {
      s.raf = requestAnimationFrame(() => tick(i));
    } else {
      s.raf = null;
      if (!s.active) {
        card.style.transform = '';
      }
    }
  }

  document.addEventListener('mousemove', e => {
    const mx = e.clientX, my = e.clientY;
    cards.forEach((card, i) => {
      const s = state[i];
      const { x: nx, y: ny } = getCenter(i);
      const dist = Math.hypot(mx - nx, my - ny);

      if (dist < PROXIMITY) {
        const force = 1 - dist / PROXIMITY;
        const angle = Math.atan2(ny - my, nx - mx);
        s.tx = Math.cos(angle) * MAX_MOVE * force;
        s.ty = Math.sin(angle) * MAX_MOVE * force;
        if (!s.active) {
          s.active = true;
          card.classList.add('near');
        }
        if (!s.raf) s.raf = requestAnimationFrame(() => tick(i));
      } else if (s.active) {
        s.tx = 0; s.ty = 0;
        s.active = false;
        card.classList.remove('near');
        if (!s.raf) s.raf = requestAnimationFrame(() => tick(i));
      }
    });
  });
})();


// ── HPC CARD SCROLL ANIMATION ──
(function() {
  function initHpcObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('hpc-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.hpc').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.07) + 's';
      if (!el.classList.contains('hpc-visible')) observer.observe(el);
    });
  }
  initHpcObserver();
  // Re-run when pages change so cards animate in on return visits
  document.addEventListener('click', () => setTimeout(initHpcObserver, 150));
})();

function filterWork(cat, btn) {
  document.querySelectorAll('.filt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.work-card').forEach(card => {
    const cats = card.dataset.cat || '';
    card.style.display = (cat === 'all' || cats.includes(cat)) ? '' : 'none';
  });
}

// ── CONTACT ──
function sendMsg() {
  if (!document.getElementById('fn').value || !document.getElementById('fe').value || !document.getElementById('fm').value) return;
  document.getElementById('cf-ok').style.display = 'block';
  ['fn','fe','fm'].forEach(id => document.getElementById(id).value = '');
  setTimeout(() => document.getElementById('cf-ok').style.display = 'none', 5000);
}
