/* ============ PENGATURAN (edit di sini) ============ */
const CONFIG = {
  name: "RIDA DWI OLIVIA",   // ganti dengan nama adikmu
  typing: "Selamat ulang tahun yang ke-17, adikku sayang. Semoga hari ini dan seterusnya selalu penuh cinta dan tawa."
};
/* ===================================================== */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rand = (a, b) => Math.random() * (b - a) + a;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nama
  $$('[data-name]').forEach(e => e.textContent = CONFIG.name);
  document.title = `Happy Birthday, ${CONFIG.name} 💗`;

  // Foto cadangan jika file belum ada
  const fallback = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF69B4"/><stop offset="1" stop-color="#15151B"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="215" font-size="90" text-anchor="middle">💗</text></svg>');
  $$('img.ph').forEach(img => {
    img.addEventListener('error', () => { img.onerror = null; img.src = fallback; }, { once: true });
    if (img.complete && img.naturalWidth === 0 && img.src) img.dispatchEvent(new Event('error'));
  });

  // Efek jatuh / melayang
  function spawn(box, items, count, up) {
    if (reduce) count = Math.ceil(count / 3);
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.textContent = items[i % items.length];
      if (up) s.className = 'up';
      s.style.cssText = `--x:${rand(0, 100)}%;--s:${rand(.8, 1.7)}rem;--d:${rand(9, 18)}s;--dl:${-rand(0, 18)}s;--dx:${rand(-80, 80)}px`;
      box.appendChild(s);
    }
  }
  spawn($('#welcomeFx'), ['🌸', '💮', '❤', '🌷'], 22);
  spawn($('#welcomeFx'), ['💗', '❤'], 10, true);

  // Musik
  const bgm = $('#bgm'), musicBtn = $('#musicBtn'), vol = $('#volume'), note = $('#musicNote');
  bgm.volume = vol.value;
  const setPlaying = p => { musicBtn.classList.toggle('playing', p); musicBtn.textContent = p ? '♫' : '♪'; };
  async function play() {
    try { await bgm.play(); note.textContent = ''; setPlaying(true); }
    catch (e) { setPlaying(false); note.textContent = 'Musik tidak bisa diputar. Cek file birthday-song.mp3 di assets/music/.'; }
  }
  bgm.addEventListener('error', () => { setPlaying(false); note.textContent = 'File musik tidak ditemukan.'; });
  musicBtn.onclick = () => bgm.paused ? play() : (bgm.pause(), setPlaying(false));
  vol.oninput = () => bgm.volume = vol.value;

  // Buka halaman utama
  $('#openBtn').onclick = () => {
    play(); // dipanggil langsung dari klik agar diizinkan browser
    const w = $('#welcome');
    w.classList.add('leave');
    $('#main').classList.remove('hidden');
    $('#player').classList.remove('hidden');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    setTimeout(() => w.remove(), 1000);
    spawn($('#heroFx'), ['🌸', '💮', '🌷'], 14);
    spawn($('#heroFx'), ['💗', '❤', '💖'], 14, true);
    typeText($('#typed'), CONFIG.typing);
    observeReveal();
  };

  // Efek mengetik
  function typeText(el, text) {
    let i = 0;
    (function tick() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 45);
    })();
  }

  // Scroll reveal
  function observeReveal() {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .15 });
    ['#gallery figure', '.wishes li'].forEach(sel => $$(sel).forEach((el, i) => el.style.setProperty('--rd', (i % 5) * .15 + 's')));
    $$('.reveal').forEach(el => io.observe(el));
  }

  // Lightbox
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  const figs = $$('#gallery figure');
  let cur = 0;
  function show(i) {
    cur = (i + figs.length) % figs.length;
    const img = $('img', figs[cur]);
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCap.textContent = $('figcaption', figs[cur]).textContent;
  }
  figs.forEach((f, i) => f.onclick = () => { show(i); lb.classList.remove('hidden'); });
  const closeLb = () => lb.classList.add('hidden');
  $('#lbClose').onclick = closeLb;
  $('#lbPrev').onclick = () => show(cur - 1);
  $('#lbNext').onclick = () => show(cur + 1);
  lb.onclick = e => { if (e.target === lb) closeLb(); };
  document.addEventListener('keydown', e => {
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  // Surat
  $('#envelope').onclick = e => {
    e.currentTarget.classList.add('open');
    e.currentTarget.setAttribute('aria-expanded', 'true');
    setTimeout(() => $('#paper').classList.add('show'), 450);
  };

  // Kejutan: confetti + hati
  const cv = $('#confetti'), ctx = cv.getContext('2d');
  let parts = [], running = false;
  const colors = ['#FFC0CB', '#FF69B4', '#ffffff', '#ff8fc5', '#ffd6e4'];
  function fit() { cv.width = innerWidth; cv.height = innerHeight; }
  addEventListener('resize', fit); fit();
  function confetti() {
    for (let i = 0; i < 160; i++) parts.push({
      x: rand(0, cv.width), y: rand(-cv.height * .4, 0), w: rand(6, 12), h: rand(8, 16),
      vy: rand(2, 5), vx: rand(-2, 2), r: rand(0, 6), vr: rand(-.2, .2), c: colors[i % colors.length]
    });
    if (!running) { running = true; loop(); }
  }
  function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => {
      p.y += p.vy; p.x += p.vx + Math.sin(p.y / 30); p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    parts = parts.filter(p => p.y < cv.height + 30);
    if (parts.length) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  }
  $('#surpriseBtn').onclick = () => {
    $('#surpriseMsg').classList.add('show');
    confetti();
    const hearts = ['💗', '💖', '❤️', '💕', '🌸'];
    for (let i = 0; i < 24; i++) {
      const h = document.createElement('span');
      h.className = 'burst';
      h.textContent = hearts[i % hearts.length];
      h.style.cssText = `left:${rand(0, 95)}%;font-size:${rand(1.2, 2.4)}rem;--dx:${rand(-60, 60)}px;animation-delay:${rand(0, 1.5)}s`;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 6000);
    }
    setTimeout(() => $('#surpriseMsg').scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  };
})();