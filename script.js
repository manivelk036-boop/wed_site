document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  document.body.style.overflow = 'hidden'; // locked until envelope opens
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hide'), 600);
  });
  // fallback in case load already fired
  setTimeout(() => preloader.classList.add('hide'), 2500);

  /* ---------- ENVELOPE OPEN INTRO ---------- */
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelopeHint');
  let envelopeOpened = false;

  function openEnvelope(){
    if(envelopeOpened) return;
    envelopeOpened = true;
    envelope.classList.add('open');
    envelopeHint.style.opacity = '0';
    tryPlay(); // user gesture: safe to start music here
    fireEnvelopeShower();
    setTimeout(() => {
      envelopeOverlay.classList.add('hide');
      document.body.style.overflow = '';
    }, 1100);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openEnvelope(); }
  });

  /* ---------- ENVELOPE OPEN PAPER SHOWER (~500 pieces) ---------- */
  const showerLayer = document.getElementById('confettiShower');
  const showerColors = ['#C9A227', '#8A2E4E', '#F8DCE2', '#5B2245', '#E9CE8E', '#ffffff', '#B98A3E'];

  function fireEnvelopeShower(){
    const count = 500;
    const frag = document.createDocumentFragment();
    for(let i=0; i<count; i++){
      const piece = document.createElement('span');
      piece.className = 'shower-piece';
      piece.style.left = (Math.random()*100) + 'vw';
      piece.style.background = showerColors[Math.floor(Math.random()*showerColors.length)];
      const w = 5 + Math.random()*5;
      const h = 8 + Math.random()*8;
      piece.style.width = w + 'px';
      piece.style.height = h + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
      piece.style.animationDuration = (2.4 + Math.random()*2) + 's';
      piece.style.animationDelay = (Math.random()*0.7) + 's';
      frag.appendChild(piece);
    }
    showerLayer.appendChild(frag);
    setTimeout(() => { showerLayer.innerHTML = ''; }, 5200);
  }

  /* ---------- COUNTDOWN (29 Oct 2026, 9:00 AM IST) ---------- */
  const weddingDate = new Date('2026-10-29T09:00:00+05:30').getTime();
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function pad(n){ return String(n).padStart(2,'0'); }

  function updateCountdown(){
    const now = Date.now();
    let diff = weddingDate - now;
    if(diff < 0) diff = 0;
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    if(cdDays){
      cdDays.textContent = pad(days);
      cdHours.textContent = pad(hours);
      cdMins.textContent = pad(mins);
      cdSecs.textContent = pad(secs);
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- BACKGROUND MUSIC ---------- */
  const music = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicToggle');
  let musicStarted = false;

  function tryPlay(){
    music.volume = 0.55;
    music.play().then(() => {
      musicStarted = true;
      musicBtn.classList.remove('paused');
    }).catch(() => {
      musicBtn.classList.add('paused');
    });
  }

  // Attempt autoplay; browsers may block until first interaction
  tryPlay();

  document.body.addEventListener('click', function firstInteract(){
    if(!musicStarted) tryPlay();
    document.body.removeEventListener('click', firstInteract);
  }, { once:false });

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if(music.paused){
      tryPlay();
    } else {
      music.pause();
      musicBtn.classList.add('paused');
    }
  });

  /* ---------- FLOATING PETALS ---------- */
  const petalContainer = document.getElementById('petals');
  const petalGlyphs = ['❀','✿','❁'];
  const PETAL_COUNT = 16;

  for(let i=0; i<PETAL_COUNT; i++){
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = petalGlyphs[Math.floor(Math.random()*petalGlyphs.length)];
    p.style.left = Math.random()*100 + 'vw';
    p.style.fontSize = (0.8 + Math.random()*1.2) + 'rem';
    p.style.animationDuration = (10 + Math.random()*14) + 's';
    p.style.animationDelay = (Math.random()*14) + 's';
    petalContainer.appendChild(p);
  }

  /* ---------- 3D TILT EFFECT ---------- */
  const tiltEls = document.querySelectorAll('[data-tilt]');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if(!isTouch){
    tiltEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width/2, cy = rect.height/2;
        const rotY = ((x - cx)/cx) * 8;
        const rotX = -((y - cy)/cy) * 8;
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealTargets = document.querySelectorAll(
    '.story-grid, .schedule-card, .map-frame, .gallery-grid, .rsvp-card, .scratch-wrap, .venue-link'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

  /* ---------- SCRATCH CARD ---------- */
  const canvas = document.getElementById('scratchCanvas');
  const resetBtn = document.getElementById('scratchReset');
  const ctx = canvas.getContext('2d');
  let isScratching = false;

  function resizeCanvas(){
    const wrap = canvas.parentElement;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight || 300;
    canvas.width = w;
    canvas.height = h;
    drawFoil();
  }

  function drawFoil(){
    const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    grad.addColorStop(0, '#e9cf8f');
    grad.addColorStop(0.5, '#c9a227');
    grad.addColorStop(1, '#e9cf8f');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `600 ${Math.max(16, canvas.width*0.045)}px 'Marcellus', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', canvas.width/2, canvas.height/2 - 14);
    ctx.font = `400 ${Math.max(11, canvas.width*0.028)}px 'Poppins', sans-serif`;
    ctx.fillText('to reveal our wedding date', canvas.width/2, canvas.height/2 + 16);

    ctx.globalCompositeOperation = 'source-over';
  }

  function getPos(e){
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function scratch(e){
    const pos = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, Math.max(canvas.width*0.06, 22), 0, Math.PI*2);
    ctx.fill();
  }

  let confettiFired = false;
  const confettiLayer = document.getElementById('confettiLayer');
  const confettiColors = ['#C9A227', '#8A2E4E', '#F8DCE2', '#5B2245', '#E9CE8E', '#ffffff'];

  function fireConfetti(){
    if(confettiFired) return;
    confettiFired = true;
    const count = 500;
    const vw = window.innerWidth || 400;
    const vh = window.innerHeight || 800;
    // pops burst outward from the center of the scratch card in every direction,
    // then fall down well past the bottom of the viewport
    const originRect = document.getElementById('scratchWrap').getBoundingClientRect();
    const originLeft = originRect.left + originRect.width / 2;
    const originTop = originRect.top + originRect.height / 2;
    for(let i=0; i<count; i++){
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = originLeft + 'px';
      piece.style.top = originTop + 'px';
      // full 360-degree burst so pieces spread everywhere from the card
      const angle = Math.random() * Math.PI * 2;
      const burst = Math.max(vw, vh) * (0.35 + Math.random() * 0.55);
      const bx = Math.cos(angle) * burst;
      const by = Math.sin(angle) * burst * 0.6;
      // then drift sideways and fall well past the bottom of the viewport
      const drift = (Math.random() * 2 - 1) * vw * 0.2;
      const fall = by + vh * (0.95 + Math.random() * 0.6);
      piece.style.setProperty('--bx', bx + 'px');
      piece.style.setProperty('--by', by + 'px');
      piece.style.setProperty('--fx', (bx + drift) + 'px');
      piece.style.setProperty('--fall', fall + 'px');
      piece.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.width = (5 + Math.random() * 5) + 'px';
      piece.style.height = (10 + Math.random() * 8) + 'px';
      // 5-6s per piece so the rise, spread, and fall read as distinct stages
      piece.style.animationDuration = (5 + Math.random()) + 's';
      piece.style.animationDelay = (Math.random() * 0.5) + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
      confettiLayer.appendChild(piece);
    }
    setTimeout(() => { confettiLayer.innerHTML = ''; }, 7000);
  }

  function checkCleared(){
    const imgData = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let transparent = 0;
    for(let i=3; i<imgData.length; i+=40){
      if(imgData[i] === 0) transparent++;
    }
    const total = imgData.length/40;
    if(transparent/total > 0.55){
      canvas.style.transition = 'opacity .6s ease';
      canvas.style.opacity = '0';
      setTimeout(() => canvas.style.pointerEvents = 'none', 600);
      fireConfetti();
    }
  }

  canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
  canvas.addEventListener('mousemove', (e) => { if(isScratching){ scratch(e); checkCleared(); } });
  window.addEventListener('mouseup', () => isScratching = false);

  canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, {passive:true});
  canvas.addEventListener('touchmove', (e) => { if(isScratching){ scratch(e); checkCleared(); } }, {passive:true});
  canvas.addEventListener('touchend', () => isScratching = false);

  resetBtn.addEventListener('click', () => {
    canvas.style.opacity = '1';
    canvas.style.pointerEvents = 'auto';
    confettiFired = false;
    confettiLayer.innerHTML = '';
    resizeCanvas();
  });

  window.addEventListener('resize', resizeCanvas);
  // slight delay to ensure layout/fonts settled
  setTimeout(resizeCanvas, 150);

});
