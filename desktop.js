
    (function(){
        const modal    = document.getElementById('vimeo-modal');
        const iframe   = document.getElementById('vimeo-iframe');
        const backdrop = modal.querySelector('.vmodal-backdrop');
        const closeBtn = modal.querySelector('.vmodal-close');

        function openModal(vimeoId) {
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=3d9499&title=0&byline=0&portrait=0`;
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('is-open');
            // Pequeño delay para que cierre con animación antes de limpiar src
            setTimeout(() => { iframe.src = ''; }, 280);
            document.body.style.overflow = '';
        }

        // Click en cualquier thumbnail GIF
        document.addEventListener('click', function(e) {
            const thumb = e.target.closest('.srv-ex-thumb--gif');
            if (thumb) {
                const id = thumb.dataset.vimeo;
                if (id) openModal(id);
            }
        });

        // También click en el header (ícono ▶) de cada ejemplo
        document.addEventListener('click', function(e) {
            const play = e.target.closest('.srv-ex-play');
            if (play) {
                const card = play.closest('.srv-example');
                const thumb = card && card.querySelector('.srv-ex-thumb--gif');
                if (thumb) {
                    const id = thumb.dataset.vimeo;
                    if (id) openModal(id);
                }
            }
        });

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
        });
    })();




        function loadLottie(id, animationData) {
            if (animationData && typeof animationData === 'object' && Object.keys(animationData).length > 0) {
                lottie.loadAnimation({
                    container: document.getElementById(id),
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: animationData
                });
            }
        }
        loadLottie('lottie-blob', typeof dataBlob !== 'undefined' ? dataBlob : null);
        loadLottie('lottie-formas', typeof dataFormas !== 'undefined' ? dataFormas : null);
        loadLottie('lottie-botito', typeof dataBotito !== 'undefined' ? dataBotito : null);
        loadLottie('lottie-sobremi', typeof dataSobremi !== 'undefined' ? dataSobremi : null);




    (function(){
        const phrases = [
            [
                {t: '¿Cansado de '},
                {t: 'cargar datos manualmente', kw: true},
                {t: ' en lugar de '},
                {t: 'analizarlos', kw: true},
                {t: '?'}
            ],
            [
                {t: '¿Te cuesta '},
                {t: 'tomar decisiones', kw: true},
                {t: ' porque tu información '},
                {t: 'nunca está al día', kw: true},
                {t: '?'}
            ],
            [
                {t: '¿Sentís que las '},
                {t: 'tareas repetitivas', kw: true},
                {t: ' frenan el '},
                {t: 'crecimiento', kw: true},
                {t: ' de tu empresa?'}
            ],
            [
                {t: '¿Sentís que no podés ver la '},
                {t: 'realidad de tu negocio', kw: true},
                {t: ' en '},
                {t: 'tiempo real', kw: true},
                {t: '?'}
            ]
        ];

        const output  = document.getElementById('lcd-output');
        const segs    = [...document.querySelectorAll('.lcd-seg')];
        const TYPE_MS = 32;
        const DEL_MS  = 14;
        const PAUSE   = 2200;
        const CYCLE   = 4800;

        let cur = 0;
        let typeTimer = null;
        let cycleTimer = null;

        function buildChars(phrase) {
            const chars = [];
            phrase.forEach(seg => {
                [...seg.t].forEach(ch => chars.push({ch, kw: !!seg.kw}));
            });
            return chars;
        }

        function renderChars(chars, n) {
            let html = '';
            let i = 0;
            while (i < n) {
                const kw = chars[i].kw;
                let str = '';
                while (i < n && chars[i].kw === kw) {
                    str += chars[i].ch;
                    i++;
                }
                if (kw) {
                    html += `<span class="lcd-kw">${str}</span>`;
                } else {
                    html += str;
                }
            }
            html += '<span class="lcd-cursor"></span>';
            output.innerHTML = html;
        }

        function activateSeg(i) {
            segs.forEach((s, idx) => {
                s.classList.remove('active');
                const f = s.querySelector('.lcd-seg-fill');
                f.style.animation = 'none';
                void f.offsetWidth;
            });
            segs[i].classList.add('active');
            const fill = segs[i].querySelector('.lcd-seg-fill');
            fill.style.animation = 'none';
            void fill.offsetWidth;
            fill.style.animation = `lcdSegFill ${CYCLE}ms linear forwards`;
        }

        function runPhrase(idx) {
            cur = idx;
            const chars = buildChars(phrases[idx]);
            const total = chars.length;
            let pos = 0;

            activateSeg(idx);

            function typeNext() {
                if (pos <= total) {
                    renderChars(chars, pos);
                    pos++;
                    typeTimer = setTimeout(typeNext, TYPE_MS);
                } else {
                    typeTimer = setTimeout(deletePhrase, PAUSE);
                }
            }

            function deletePhrase() {
                if (pos > 0) {
                    pos--;
                    renderChars(chars, pos);
                    typeTimer = setTimeout(deletePhrase, DEL_MS);
                } else {
                    const next = (idx + 1) % phrases.length;
                    typeTimer = setTimeout(() => runPhrase(next), 180);
                }
            }

            typeNext();
        }

        segs.forEach((s, i) => {
            s.addEventListener('click', () => {
                clearTimeout(typeTimer);
                clearTimeout(cycleTimer);
                output.innerHTML = '';
                runPhrase(i);
            });
        });

        runPhrase(0);
    })();




    (function() {
        const CHARS_T = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|~';
        const CHARS_Y = '0123456789ABCDEF+-=><|?!@#%&*~\\';
        const CONFIG = {
            auto: { target:'Automatizá', el:'word-auto', cur:'cur-auto', charSet:CHARS_T, colorClass:'scrambled-t', lockedClass:'locked-t', scramblesPerChar:6, frameMs:55, resolveEvery:2, holdMs:6800, restartMs:400 },
            vis:  { target:'Visualizá',  el:'word-vis',  cur:'cur-vis',  charSet:CHARS_Y, colorClass:'scrambled-y', lockedClass:'locked-y', scramblesPerChar:6, frameMs:55, resolveEvery:2, holdMs:6800, restartMs:400 }
        };
        function rnd(str){ return str[Math.floor(Math.random()*str.length)]; }
        function runDecode(cfg, delayMs){
            setTimeout(function loop(){
                const letters=[...cfg.target], n=letters.length;
                const resolved=new Array(n).fill(false);
                let resolvedCount=0, frame=0;
                const curEl=document.getElementById(cfg.cur);
                if(curEl) curEl.style.display='inline-block';
                function render(){
                    let html='';
                    for(let i=0;i<n;i++){
                        html += resolved[i]
                            ? `<span class="dc ${cfg.lockedClass}">${letters[i]}</span>`
                            : `<span class="dc ${cfg.colorClass}">${rnd(cfg.charSet)}</span>`;
                    }
                    document.getElementById(cfg.el).innerHTML=html;
                }
                function step(){
                    frame++;
                    if(frame%cfg.resolveEvery===0&&resolvedCount<n){ resolved[resolvedCount]=true; resolvedCount++; }
                    render();
                    if(resolvedCount<n){ setTimeout(step,cfg.frameMs); }
                    else {
                        document.getElementById(cfg.el).innerHTML=`<span class="dc ${cfg.lockedClass}">${cfg.target}</span>`;
                        if(curEl) curEl.style.display='none';
                        setTimeout(function(){ if(curEl) curEl.style.display='inline-block'; loop(); }, cfg.holdMs+cfg.restartMs);
                    }
                }
                render();
                setTimeout(step, cfg.frameMs*2);
            }, delayMs);
        }
        runDecode(CONFIG.auto, 2800);
        runDecode(CONFIG.vis,  5200);
    })();



    (function(){
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-links a[data-section]');
        const sections = ['servicios','faq','sobre-mi','contacto'].map(id => document.getElementById(id)).filter(Boolean);

        // Scrolled class para el glassmorphism más opaco
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });

        // IntersectionObserver para el link activo
        // rootMargin: detecta cuando el tope de la sección cruza una banda horizontal en pantalla
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(a => {
                        a.classList.toggle('active', a.dataset.section === id);
                    });
                }
            });
        }, { rootMargin: '-10% 0px -85% 0px', threshold: 0 });

        sections.forEach(s => observer.observe(s));
    })();




    (function(){
        const svc = document.getElementById('servicios');
        if (!svc) return;
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                svc.classList.add('in-view');
                obs.disconnect();
            }
        }, { threshold: 0.08 });
        obs.observe(svc);
    })();




    (function(){
        const configs = {
            'faq':       { threshold: 0.3  },
            'sobre-mi':  { threshold: 0.15 },
            'contacto':  { threshold: 0.15 }
        };
        Object.entries(configs).forEach(function([id, opts]) {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    el.classList.add('in-view');
                    obs.disconnect();
                }
            }, { threshold: opts.threshold });
            obs.observe(el);
        });
    })();
  


    (function(){
        const bar = document.getElementById('navbar-progress');
        if (!bar) return;
        function update() {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
            bar.style.width = pct + '%';
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    })();




    (function(){
        const scroller = document.querySelector('.stack-scroller');
        const cards    = document.querySelectorAll('.srv-card');
        if (!scroller || !cards.length) return;
        const CARD_COUNT = cards.length;

        function update() {
            const rect    = scroller.getBoundingClientRect();
            const viewH   = window.innerHeight;
            const scrollH = scroller.offsetHeight - viewH;
            const progress = Math.max(0, Math.min(1, -rect.top / Math.max(scrollH, 1)));
            const cardProg = progress * CARD_COUNT;

            cards.forEach((card, i) => {
                const active = Math.min(Math.floor(cardProg), CARD_COUNT - 1);

                if (i < active) {
                    // Cards behind: shrink and push up slightly
                    const behind = active - i;
                    const sc = 1 - behind * 0.04;
                    const ty = -behind * 20;
                    card.style.transform = `translateY(${ty}px) scale(${sc})`;
                    card.style.opacity   = Math.max(0, 1 - behind * 0.35) + '';
                    card.style.zIndex    = 10 + i;
                    card.style.pointerEvents = 'none';
                } else if (i === active) {
                    // Active card
                    const local = cardProg - i;
                    let ty = 0;
                    if (i > 0) ty = (1 - local) * 60;
                    card.style.transform = `translateY(${ty}px) scale(1)`;
                    card.style.opacity   = i === 0 ? '1' : Math.min(1, local * 2) + '';
                    card.style.zIndex    = 10 + i;
                    card.style.pointerEvents = 'auto';
                } else {
                    // Cards not yet shown
                    card.style.transform = 'translateY(70px) scale(1)';
                    card.style.opacity   = '0';
                    card.style.zIndex    = 10 + i;
                    card.style.pointerEvents = 'none';
                }
            });
        }

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        update();
    })();




    (function(){
        document.querySelectorAll('.faq-item').forEach(item => {
            const btn   = item.querySelector('.faq-q');
            const panel = item.querySelector('.faq-a');
            const icon  = item.querySelector('.faq-icon');
            btn.addEventListener('click', () => {
                const isOpen = item.dataset.open === 'true';
                document.querySelectorAll('.faq-item').forEach(other => {
                    other.dataset.open = 'false';
                    other.querySelector('.faq-a').classList.remove('faq-a--visible');
                    other.querySelector('.faq-icon').textContent = '+';
                    other.classList.remove('faq-item--open');
                });
                if (!isOpen) {
                    item.dataset.open = 'true';
                    item.classList.add('faq-item--open');
                    panel.classList.add('faq-a--visible');
                    icon.textContent = '−';
                }
            });
        });
    })();




    (function(){
        const fills = document.querySelectorAll('.ask-fill');
        if (!fills.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const w = e.target.dataset.width;
                    e.target.style.transition = 'width 1.1s cubic-bezier(.16,1,.3,1)';
                    e.target.style.width = w;
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        fills.forEach(f => {
            f.dataset.width = f.style.width;
            f.style.width = '0';
            observer.observe(f);
        });
    })();




    (function () {
        const track     = document.getElementById('c1-track');
        const prevBtn   = document.getElementById('c1-prev');
        const nextBtn   = document.getElementById('c1-next');
        const dotsWrap  = document.getElementById('c1-dots');
        if (!track) return;

        const slides     = track.querySelectorAll('.c1-slide');
        const totalSlides = slides.length;
        let current      = 0;
        let autoTimer    = null;
        let userInteracted = false;
        const AUTO_DELAY = 3800; // ms entre slides

        function goTo(idx) {
            current = (idx + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${current * 100}%)`;
            // Dots
            dotsWrap.querySelectorAll('.c1-dot').forEach((d, i) => {
                d.classList.toggle('c1-dot--active', i === current);
            });
        }

        function startAuto() {
            if (autoTimer) clearInterval(autoTimer);
            if (userInteracted) return;
            autoTimer = setInterval(() => goTo(current + 1), AUTO_DELAY);
        }

        function stopAuto() {
            userInteracted = true;
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); });
        nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); });

        dotsWrap.querySelectorAll('.c1-dot').forEach((d, i) => {
            d.addEventListener('click', () => { stopAuto(); goTo(i); });
        });

        // Iniciar auto-rotación
        goTo(0);
        startAuto();
    })();
  


    (function () {
      const svcSection = document.getElementById('servicios');
      const card1      = document.getElementById('card-1');
      const card2      = document.getElementById('card-2');
      const card3      = document.getElementById('card-3');
      const svcTabs    = document.querySelectorAll('.srv-ind');

      let lastActive = 0;
      function setActiveTab(i) {
        if (i === lastActive) return;
        lastActive = i;
        svcTabs.forEach((t, j) => {
          t.classList.toggle('srv-ind--active', i === j);
          if (i === j) {
            const fill = t.querySelector('.srv-ind-fill');
            if (fill) {
              fill.style.transition = 'none';
              fill.style.width = '0';
              requestAnimationFrame(() => {
                fill.style.transition = 'width 3s linear';
                fill.style.width = '100%';
              });
            }
          }
        });
      }

      function setup() {
        const zone  = document.getElementById('cards-zone');
        const zoneH = zone.offsetHeight;   // altura real del 80%

        const h1 = zoneH * 1.0;
        const h2 = zoneH * 0.97;
        const h3 = zoneH * 0.94;

        const top1 = zoneH - h1;   // = 0, arranca desde arriba de la zona
        const top2 = zoneH - h2;
        const top3 = zoneH - h3;

        card1.style.top = top1 + 'px';

        card2.style.height = h2 + 'px';
        card3.style.height = h3 + 'px';

        card2.style.bottom = 'auto';
        card3.style.bottom = 'auto';
        card2.style.top = zoneH + 'px';   // fuera de la zona, entra con scroll
        card3.style.top = zoneH + 'px';

        zone._top2  = top2;
        zone._top3  = top3;
        zone._zoneH = zoneH;
      }

      // ── Snap-pause config ──────────────────────────────────────
      // Cada tarjeta tiene una "zona de pausa" al llegar a su tope.
      // SNAP_HOLD: fracción del scroll total que se "congela" en cada tope.
      const SNAP_HOLD = 0.10;   // 10% del scroll total = pausa perceptible

      // Distribución del progreso:
      //  0 ──── 0.45 → card-2 sube        (45% del scroll)
      //  0.45 ── 0.55 → tope card-2        (10% = SNAP_HOLD)
      //  0.55 ── 1.00 → card-3 sube        (45%)
      //  (no hay tope final: simplemente llega al destino y el scroll continúa)

      const C2_START  = 0;
      const C2_END    = 0.45;
      const C2_HOLD_END = C2_END + SNAP_HOLD;   // 0.55
      const C3_START  = C2_HOLD_END;
      const C3_END    = 1.0;

      function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function onScroll() {
        const rect  = svcSection.getBoundingClientRect();
        const total = svcSection.offsetHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / total));

        const zone  = document.getElementById('cards-zone');
        const { _top2, _top3, _zoneH } = zone;

        // ── Card 2 ──
        const t2Raw = (progress - C2_START) / (C2_END - C2_START);
        const t2    = easeOut(Math.max(0, Math.min(1, t2Raw)));
        const top2  = _zoneH - t2 * (_zoneH - _top2);
        card2.style.top = top2 + 'px';

        // Ocultar sombra hasta que el borde superior asome (t2 > 0)
        card2.style.opacity = t2 > 0.01 ? '1' : '0';

        // ── Card 3 ──
        const t3Raw = (progress - C3_START) / (C3_END - C3_START);
        const t3    = easeOut(Math.max(0, Math.min(1, t3Raw)));
        const top3  = _zoneH - t3 * (_zoneH - _top3);
        card3.style.top = top3 + 'px';

        // Ocultar sombra hasta que el borde superior asome (t3 > 0)
        card3.style.opacity = t3 > 0.01 ? '1' : '0';

        // ── Tabs ──
        if (t2 < 0.05)      setActiveTab(0);
        else if (t3 < 0.05) setActiveTab(1);
        else                setActiveTab(2);
      }

      // Inicializar opacity oculta
      card2.style.opacity = '0';
      card3.style.opacity = '0';

      // ── Click en pills: scroll a la tarjeta correspondiente ──
      svcTabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
          const rect  = svcSection.getBoundingClientRect();
          const total = svcSection.offsetHeight - window.innerHeight;
          const targets = [0, C2_END + SNAP_HOLD / 2, 1];
          const targetProgress = targets[i];
          const targetScrollY  = window.scrollY + rect.top + targetProgress * total;
          window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        });
      });

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => { setup(); onScroll(); });
      setup();
      onScroll();

      // Animar fill del primer pill al cargar
      window.addEventListener('load', () => {
        const firstFill = document.querySelector('.srv-ind--active .srv-ind-fill');
        if (firstFill) {
          firstFill.style.transition = 'width 3s linear';
          firstFill.style.width = '100%';
        }
      });
    })();



    window.addEventListener('load', () => {

      // ── Animación de dibujo del SVG al cargar ──
      const delays = [0.25, 0.4, 0.55, 0.64, 0.69, 0.76, 0.82];
      document.querySelectorAll('.logo-svg path, .logo-svg circle').forEach((el, i) => {
        let len;
        try { len = el.getTotalLength(); } catch(e) { len = 900; }
        len = Math.ceil(len) + 6;
        el.style.strokeDasharray  = len;
        el.style.strokeDashoffset = len;
        el.style.animation = 'none';
        void el.getBoundingClientRect();
        el.style.animation = `drawStroke 1.4s cubic-bezier(.4,0,.2,1) ${delays[i] ?? .82}s forwards`;
      });

      // ════════════════════════════════════════════
      //  BOT PERSONALITY ENGINE
      // ════════════════════════════════════════════
      const svg      = document.querySelector('.logo-svg');
      const circles  = [...document.querySelectorAll('.logo-svg circle')];
      const leftEye  = circles.find(c => parseFloat(c.getAttribute('cx')) < 260);
      const rightEye = circles.find(c => parseFloat(c.getAttribute('cx')) > 260);
      if (!leftEye || !rightEye) return;

      const L = { cx: 192.8, cy: 225.5, r: 25.7 };
      const R = { cx: 313.9, cy: 225.5, r: 25.7 };
      const FADE = 70;

      let busy = false; // evita que dos animaciones se superpongan

      // ── Utilidades ──
      function fadeEl(el, toOpacity, dur) {
        el.style.transition = `opacity ${dur}ms ease`;
        el.style.opacity = toOpacity;
      }

      function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

      // Crea un círculo desplazado (mirada lateral/arriba)
      function makeLookCircle(eye, dx, dy) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', eye.cx + dx);
        c.setAttribute('cy', eye.cy + dy);
        c.setAttribute('r',  eye.r * 0.85);
        c.setAttribute('fill', 'var(--tl)');
        c.style.opacity = '0';
        c.style.transition = `opacity ${FADE}ms ease`;
        return c;
      }

      // Crea el path de guiño (chevron)
      function makeWinkPath(eye) {
        const p  = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const px = eye.cx - eye.r * 0.85;
        const ty = eye.cy - eye.r * 0.72;
        const by = eye.cy + eye.r * 0.72;
        const rx = eye.cx + eye.r * 0.55;
        p.setAttribute('d', `M ${rx} ${ty} L ${px} ${eye.cy} L ${rx} ${by}`);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', 'var(--tl)');
        p.setAttribute('stroke-width', '10');
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('stroke-linejoin', 'round');
        p.style.opacity = '0';
        p.style.transition = `opacity ${FADE}ms ease`;
        return p;
      }

      // Crea una línea horizontal (parpadeo = ojo cerrado)
      function makeBlinkPath(eye) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', `M ${eye.cx - eye.r * 0.7} ${eye.cy} L ${eye.cx + eye.r * 0.7} ${eye.cy}`);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', 'var(--tl)');
        p.setAttribute('stroke-width', '9');
        p.setAttribute('stroke-linecap', 'round');
        p.style.opacity = '0';
        p.style.transition = `opacity ${FADE}ms ease`;
        return p;
      }

      // ── Acción: GUIÑO (ojo derecho) ──
      async function doWink() {
        if (busy) return; busy = true;
        const wink = makeWinkPath(R);
        svg.appendChild(wink);
        fadeEl(rightEye, '0', FADE);
        await sleep(FADE);
        wink.style.opacity = '1';
        await sleep(900);
        wink.style.opacity = '0';
        fadeEl(rightEye, '1', FADE);
        await sleep(FADE + 30);
        wink.remove();
        rightEye.style.transition = '';
        busy = false;
      }

      // ── Acción: PARPADEO (ambos ojos) ──
      async function doBlink() {
        if (busy) return; busy = true;
        const bL = makeBlinkPath(L);
        const bR = makeBlinkPath(R);
        svg.appendChild(bL);
        svg.appendChild(bR);
        fadeEl(leftEye,  '0', FADE);
        fadeEl(rightEye, '0', FADE);
        await sleep(FADE);
        bL.style.opacity = '1';
        bR.style.opacity = '1';
        await sleep(120);
        bL.style.opacity = '0';
        bR.style.opacity = '0';
        fadeEl(leftEye,  '1', FADE);
        fadeEl(rightEye, '1', FADE);
        await sleep(FADE + 30);
        bL.remove(); bR.remove();
        leftEye.style.transition  = '';
        rightEye.style.transition = '';
        busy = false;
      }

      // ── Acción: DOBLE PARPADEO ──
      async function doDoubleBlink() {
        await doBlink();
        await sleep(180);
        await doBlink();
      }

      // ── Acción: MIRADA (dx, dy relativo al centro) ──
      async function doLook(dx, dy) {
        if (busy) return; busy = true;
        const cL = makeLookCircle(L, dx, dy);
        const cR = makeLookCircle(R, dx, dy);
        svg.appendChild(cL);
        svg.appendChild(cR);
        fadeEl(leftEye,  '0', FADE);
        fadeEl(rightEye, '0', FADE);
        await sleep(FADE);
        cL.style.opacity = '1';
        cR.style.opacity = '1';
        await sleep(700);
        cL.style.opacity = '0';
        cR.style.opacity = '0';
        fadeEl(leftEye,  '1', FADE);
        fadeEl(rightEye, '1', FADE);
        await sleep(FADE + 30);
        cL.remove(); cR.remove();
        leftEye.style.transition  = '';
        rightEye.style.transition = '';
        busy = false;
      }

      // ── Acción: OJITOS FELICES (^ ^) ──
      async function doHappyEyes() {
        if (busy) return; busy = true;
        // Arco hacia arriba: una curva que simula el ^ con stroke
        function makeHappyPath(eye) {
          const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const x  = eye.cx;
          const y  = eye.cy;
          const rx = eye.r * 0.85;
          const lift = eye.r * 0.7;
          // Arco: de izquierda a derecha, con punto de control arriba
          p.setAttribute('d', `M ${x - rx} ${y + lift * 0.3} Q ${x} ${y - lift} ${x + rx} ${y + lift * 0.3}`);
          p.setAttribute('fill', 'none');
          p.setAttribute('stroke', 'var(--tl)');
          p.setAttribute('stroke-width', '9');
          p.setAttribute('stroke-linecap', 'round');
          p.style.opacity = '0';
          p.style.transition = `opacity ${FADE}ms ease`;
          return p;
        }
        const hL = makeHappyPath(L);
        const hR = makeHappyPath(R);
        svg.appendChild(hL);
        svg.appendChild(hR);
        fadeEl(leftEye,  '0', FADE);
        fadeEl(rightEye, '0', FADE);
        await sleep(FADE);
        hL.style.opacity = '1';
        hR.style.opacity = '1';
        await sleep(800);
        hL.style.opacity = '0';
        hR.style.opacity = '0';
        fadeEl(leftEye,  '1', FADE);
        fadeEl(rightEye, '1', FADE);
        await sleep(FADE + 30);
        hL.remove(); hR.remove();
        leftEye.style.transition  = '';
        rightEye.style.transition = '';
        busy = false;
      }

      // ════════════════════════════════════════════
      //  ANIMACIÓN DEL NOMBRE  (.logo-name)
      // ════════════════════════════════════════════
      const logoName = document.querySelector('.logo-name');
      const logoBotSpan = document.querySelector('.logo-bot');
      let nameBusy = false;

      // Glitch: reemplaza letras por caracteres random brevemente
      async function doGlitch() {
        if (nameBusy) return; nameBusy = true;
        const original = 'iquín Soluciones';
        const glitchChars = '█▓▒░#@!?$%&';
        let iter = 0;
        const maxIter = 10;
        await new Promise(resolve => {
          const interval = setInterval(() => {
            const glitched = original.split('').map((ch, i) =>
              i < iter / maxIter * original.length
                ? ch
                : (Math.random() > 0.6 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : ch)
            ).join('');
            // Solo toca el texto fuera del span .logo-bot
            logoName.childNodes.forEach(node => {
              if (node.nodeType === 3) node.textContent = glitched; // texto plano
            });
            iter++;
            if (iter > maxIter) {
              clearInterval(interval);
              logoName.childNodes.forEach(node => {
                if (node.nodeType === 3) node.textContent = 'iquín Soluciones';
              });
              resolve();
            }
          }, 55);
        });
        nameBusy = false;
      }

      // Shimmer dorado: aplica la clase por un momento
      async function doShimmer() {
        if (nameBusy) return; nameBusy = true;
        logoName.style.background = 'linear-gradient(90deg, var(--tl), var(--gl), var(--g), var(--tl))';
        logoName.style.backgroundSize = '300%';
        logoName.style.webkitBackgroundClip = 'text';
        logoName.style.backgroundClip = 'text';
        logoName.style.webkitTextFillColor = 'transparent';
        logoName.style.animation = 'shimmer 1s linear forwards';
        await sleep(1100);
        logoName.style.background = '';
        logoName.style.backgroundSize = '';
        logoName.style.webkitBackgroundClip = '';
        logoName.style.backgroundClip = '';
        logoName.style.webkitTextFillColor = '';
        logoName.style.animation = '';
        nameBusy = false;
      }

      // Pulso del color: teal → gold → teal en el nombre
      async function doColorPulse() {
        if (nameBusy) return; nameBusy = true;
        logoName.style.transition = 'color .3s ease';
        logoName.style.color = 'var(--g)';
        await sleep(400);
        logoName.style.color = 'var(--tl)';
        await sleep(400);
        logoName.style.transition = '';
        logoName.style.color = '';
        nameBusy = false;
      }

      // ════════════════════════════════════════════
      //  SCHEDULER — elige acción aleatoria cada N segundos
      // ════════════════════════════════════════════
      // ── Acción: SORPRENDIDO (ojos grandes) ──
      async function doSurprised() {
        if (busy) return; busy = true;
        // Agrandar los círculos existentes con CSS transform
        const scale = 1.55;
        [leftEye, rightEye].forEach(eye => {
          eye.style.transition = 'r .12s ease';
          eye.setAttribute('r', L.r * scale);
        });
        await sleep(350);
        [leftEye, rightEye].forEach(eye => {
          eye.style.transition = 'r .2s ease';
          eye.setAttribute('r', L.r * 1.1);
        });
        await sleep(200);
        [leftEye, rightEye].forEach(eye => {
          eye.setAttribute('r', L.r);
          eye.style.transition = '';
        });
        busy = false;
      }

      // ── Acción: ASIENTE (bounce vertical) ──
      async function doNod() {
        if (busy) return; busy = true;
        const dy = 10; // píxeles que bajan
        async function moveEyes(offsetY, dur) {
          [leftEye, rightEye].forEach(eye => {
            eye.style.transition = `cy ${dur}ms ease`;
          });
          leftEye.setAttribute('cy',  L.cy + offsetY);
          rightEye.setAttribute('cy', R.cy + offsetY);
          await sleep(dur + 10);
        }
        await moveEyes(dy,   120);
        await moveEyes(-4,   90);
        await moveEyes(dy/2, 80);
        await moveEyes(0,    100);
        [leftEye, rightEye].forEach(eye => { eye.style.transition = ''; });
        leftEye.setAttribute('cy',  L.cy);
        rightEye.setAttribute('cy', R.cy);
        busy = false;
      }

      // ── Acción: GUIÑO + MIRADA (coqueto) ──
      async function doWinkThenLook() {
        await doWink();
        await sleep(300);
        await doLook(8, 0);
      }

      const BOT_ACTIONS = [
        { fn: doWink,                  weight: 3 },
        { fn: doBlink,                 weight: 2 },
        { fn: doDoubleBlink,           weight: 1 },
        { fn: () => doLook( 10,  0),   weight: 2 },
        { fn: () => doLook(-10,  0),   weight: 2 },
        { fn: doHappyEyes,             weight: 2 },
      ];

      const NAME_ACTIONS = [
        { fn: doGlitch, weight: 1 },
      ];

      function pickWeighted(list) {
        const total = list.reduce((s, a) => s + a.weight, 0);
        let r = Math.random() * total;
        for (const a of list) { r -= a.weight; if (r <= 0) return a.fn; }
        return list[0].fn;
      }

      function scheduleBot() {
        // entre 4 y 9 segundos entre acciones del bot
        const delay = 2000 + Math.random() * 1500;
        setTimeout(async () => {
          await pickWeighted(BOT_ACTIONS)();
          scheduleBot();
        }, delay);
      }

      function scheduleName() {
        // entre 7 y 16 segundos entre animaciones del nombre
        const delay = 7000 + Math.random() * 9000;
        setTimeout(async () => {
          await pickWeighted(NAME_ACTIONS)();
          scheduleName();
        }, delay);
      }

      // Arranca después de que termina la animación de dibujo inicial
      setTimeout(() => {
        scheduleBot();
        scheduleName();
      }, 3200);

    });
