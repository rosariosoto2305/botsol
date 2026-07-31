    (function(){
        function tryLoadSobremi() {
            if (typeof dataSobremi === 'undefined') {
                setTimeout(tryLoadSobremi, 50);
                return;
            }
            var el = document.getElementById('m-lottie-sobremi');
            if (!el) return;
            lottie.loadAnimation({
                container: el,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: dataSobremi
            });
        }
        tryLoadSobremi();
    })();


    (function(){
        const track    = document.getElementById('m-auto-track');
        const dotsWrap = document.getElementById('m-auto-dots');
        const prevBtn  = document.getElementById('m-auto-prev');
        const nextBtn  = document.getElementById('m-auto-next');
        if (!track) return;

        const slides  = track.querySelectorAll('.m-auto-slide');
        const AUTO_MS = 3500;
        let current   = 0;
        let startX    = 0;
        let autoTimer = null;
        let stopped   = false;

        function goTo(idx) {
            current = (idx + slides.length) % slides.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            dotsWrap.querySelectorAll('.m-auto-dot').forEach((d, i) =>
                d.classList.toggle('m-auto-dot--active', i === current));
        }

        function stopAuto() {
            if (stopped) return;
            stopped = true;
            clearInterval(autoTimer);
        }

        // Interacción usuario → detiene el auto definitivamente
        dotsWrap.querySelectorAll('.m-auto-dot').forEach((d, i) =>
            d.addEventListener('click', () => { stopAuto(); goTo(i); }));
        prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); });
        nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); });

        // Swipe
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) { stopAuto(); goTo(diff > 0 ? current + 1 : current - 1); }
        });

        goTo(0);
        autoTimer = setInterval(() => goTo(current + 1), AUTO_MS);
    })();
    (function(){
        const modal    = document.getElementById('m-vimeo-modal');
        const iframe   = document.getElementById('m-vimeo-iframe');
        const backdrop = modal.querySelector('.m-vmodal-backdrop');
        const closeBtn = modal.querySelector('.m-vmodal-close');
        function openModal(id) {
            iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&color=3d9499&title=0&byline=0&portrait=0`;
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }
        function closeModal() {
            modal.classList.remove('is-open');
            setTimeout(() => { iframe.src = ''; }, 280);
            document.body.style.overflow = '';
        }
        document.addEventListener('click', e => {
            const thumb = e.target.closest('.m-auto-ex-thumb');
            if (thumb?.dataset.vimeo) openModal(thumb.dataset.vimeo);
        });
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
        });
    })();

  
    (function () {
        function startNavbarDraw() {
            var delays = [0.05, 0.15, 0.28, 0.38, 0.44, 0.50, 0.56];
            document.querySelectorAll('.m-logo-svg path, .m-logo-svg circle').forEach(function(el, i) {
                var len;
                try { len = el.getTotalLength(); } catch(e) { len = 900; }
                len = Math.ceil(len) + 6;
                el.style.strokeDasharray  = len;
                el.style.strokeDashoffset = len;
                el.style.animation = 'none';
                void el.getBoundingClientRect();
                el.style.animation = 'drawStroke 1.4s cubic-bezier(.4,0,.2,1) ' + (delays[i] !== undefined ? delays[i] : 0.56) + 's forwards';
            });
        }

        function revealHero() {
            requestAnimationFrame(function () {
                document.querySelectorAll('.m-hero-enter').forEach(function (el) {
                    el.classList.add('is-hero-visible');
                });
                startNavbarDraw();
            });
        }

        // El loader ahora es unico y vive en index.html (ver #site-loader).
        // Enganchamos el reveal del hero + el dibujado del navbar a que
        // termine ese loader compartido, en vez de depender de un
        // #m-loader propio de esta version que ya no existe.
        if (window.__onSiteLoaderDone) {
            window.__onSiteLoaderDone(revealHero);
        } else {
            // Fallback por si este archivo se usa fuera de index.html
            // (ej. abriendo mobile.html suelto, sin el loader compartido)
            window.addEventListener('load', revealHero);
        }
    })();
    


  
    (function () {
        const selectors = [
            '.m-reveal',
            '.m-reveal-left',
            '.m-reveal-right',
            '.m-reveal-scale'
        ].join(',');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
        );

        document.querySelectorAll(selectors).forEach(el => observer.observe(el));
    })();
    


  
    (function() {
        const btn     = document.getElementById('m-hamburger');
        const drawer  = document.getElementById('m-drawer');
        const overlay = document.getElementById('m-drawer-overlay');
        const links   = drawer.querySelectorAll('.m-drawer-link');

        function openMenu() {
            btn.classList.add('is-open');
            drawer.classList.add('is-open');
            overlay.classList.add('is-visible');
            btn.setAttribute('aria-expanded', 'true');
            drawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            btn.classList.remove('is-open');
            drawer.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            btn.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        btn.addEventListener('click', () => btn.classList.contains('is-open') ? closeMenu() : openMenu());
        overlay.addEventListener('click', closeMenu);
        links.forEach(l => l.addEventListener('click', closeMenu));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

        const bar = document.getElementById('m-navbar-progress');
        window.addEventListener('scroll', () => {
            document.getElementById('m-navbar').classList.toggle('scrolled', window.scrollY > 10);
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = docH > 0 ? (window.scrollY / docH * 100) + '%' : '0%';
        }, { passive: true });
    })();
    


  
    (function(){
        function loadLottie(id, animationData) {
            const container = document.getElementById(id);
            if (!container) return;
            if (!animationData || typeof animationData !== 'object' || !Object.keys(animationData).length) return;
            lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
            });
        }

        function init() {
            loadLottie('m-lottie-blob',   typeof dataBlob   !== 'undefined' ? dataBlob   : null);
            loadLottie('m-lottie-formas', typeof dataFormas !== 'undefined' ? dataFormas : null);
            loadLottie('m-lottie-botito', typeof dataBotito !== 'undefined' ? dataBotito : null);
        }

        // Si lottie ya cargó, inicializar directo; si no, esperar
        if (typeof lottie !== 'undefined') {
            init();
        } else {
            document.addEventListener('DOMContentLoaded', init);
        }
    })();
    


  
    (function(){
        const phrases = [
            [ {t:'¿Cansado de '}, {t:'cargar datos manualmente', kw:true}, {t:' en lugar de '}, {t:'analizarlos', kw:true}, {t:'?'} ],
            [ {t:'¿Te cuesta '}, {t:'tomar decisiones', kw:true}, {t:' porque tu información '}, {t:'nunca está al día', kw:true}, {t:'?'} ],
            [ {t:'¿Sentís que las '}, {t:'tareas repetitivas', kw:true}, {t:' frenan el '}, {t:'crecimiento', kw:true}, {t:' de tu empresa?'} ],
            [ {t:'¿Sentís que no podés ver la '}, {t:'realidad de tu negocio', kw:true}, {t:' en '}, {t:'tiempo real', kw:true}, {t:'?'} ]
        ];

        const output = document.getElementById('m-bubble-output');
        const TYPE_MS = 38, DEL_MS = 16, PAUSE = 2000;

        let typeTimer = null;

        function buildChars(phrase) {
            const chars = [];
            phrase.forEach(seg => [...seg.t].forEach(ch => chars.push({ch, kw:!!seg.kw})));
            return chars;
        }

        function renderChars(chars, n) {
            let html = '', i = 0;
            while (i < n) {
                const kw = chars[i].kw;
                let str = '';
                while (i < n && chars[i].kw === kw) { str += chars[i].ch; i++; }
                html += kw ? `<span class="m-bubble-kw">${str}</span>` : str;
            }
            html += '<span class="m-bubble-cursor"></span>';
            output.innerHTML = html;
        }

        function runPhrase(idx) {
            const chars = buildChars(phrases[idx]);
            const total = chars.length;
            let pos = 0;

            function typeNext() {
                if (pos <= total) { renderChars(chars, pos); pos++; typeTimer = setTimeout(typeNext, TYPE_MS); }
                else { typeTimer = setTimeout(deletePhrase, PAUSE); }
            }
            function deletePhrase() {
                if (pos > 0) { pos--; renderChars(chars, pos); typeTimer = setTimeout(deletePhrase, DEL_MS); }
                else { typeTimer = setTimeout(() => runPhrase((idx + 1) % phrases.length), 180); }
            }
            typeNext();
        }

        runPhrase(0);
    })();
    


  
    (function() {
        const CHARS_T = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|~';
        const CHARS_Y = '0123456789ABCDEF+-=><|?!@#%&*~\\';
        const CONFIG = {
            auto: { target:'Automatizá', el:'m-word-auto', cur:'m-cur-auto', charSet:CHARS_T, colorClass:'scrambled-t', lockedClass:'locked-t', scramblesPerChar:6, frameMs:55, resolveEvery:2, holdMs:6800, restartMs:400 },
            vis:  { target:'Visualizá',  el:'m-word-vis',  cur:'m-cur-vis',  charSet:CHARS_Y, colorClass:'scrambled-y', lockedClass:'locked-y', scramblesPerChar:6, frameMs:55, resolveEvery:2, holdMs:6800, restartMs:400 }
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
    


  
    window.addEventListener('load', () => {

        // ── Animación de dibujo del SVG: iniciada desde dismissLoader() ──

        // ════════════════════════════════════════════
        //  BOT PERSONALITY ENGINE
        // ════════════════════════════════════════════
        const svg      = document.querySelector('.m-logo-svg');
        const circles  = [...document.querySelectorAll('.m-logo-svg circle')];
        const leftEye  = circles.find(c => parseFloat(c.getAttribute('cx')) < 260);
        const rightEye = circles.find(c => parseFloat(c.getAttribute('cx')) > 260);
        if (!leftEye || !rightEye) return;

        const L = { cx: 192.8, cy: 225.5, r: 25.7 };
        const R = { cx: 313.9, cy: 225.5, r: 25.7 };
        const FADE = 70;
        let busy = false;

        function fadeEl(el, toOpacity, dur) {
            el.style.transition = `opacity ${dur}ms ease`;
            el.style.opacity = toOpacity;
        }
        function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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
        function makeWinkPath(eye) {
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
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
        async function doBlink() {
            if (busy) return; busy = true;
            const bL = makeBlinkPath(L), bR = makeBlinkPath(R);
            svg.appendChild(bL); svg.appendChild(bR);
            fadeEl(leftEye, '0', FADE); fadeEl(rightEye, '0', FADE);
            await sleep(FADE);
            bL.style.opacity = '1'; bR.style.opacity = '1';
            await sleep(120);
            bL.style.opacity = '0'; bR.style.opacity = '0';
            fadeEl(leftEye, '1', FADE); fadeEl(rightEye, '1', FADE);
            await sleep(FADE + 30);
            bL.remove(); bR.remove();
            leftEye.style.transition = ''; rightEye.style.transition = '';
            busy = false;
        }
        async function doDoubleBlink() {
            await doBlink(); await sleep(180); await doBlink();
        }
        async function doLook(dx, dy) {
            if (busy) return; busy = true;
            const cL = makeLookCircle(L, dx, dy), cR = makeLookCircle(R, dx, dy);
            svg.appendChild(cL); svg.appendChild(cR);
            fadeEl(leftEye, '0', FADE); fadeEl(rightEye, '0', FADE);
            await sleep(FADE);
            cL.style.opacity = '1'; cR.style.opacity = '1';
            await sleep(700);
            cL.style.opacity = '0'; cR.style.opacity = '0';
            fadeEl(leftEye, '1', FADE); fadeEl(rightEye, '1', FADE);
            await sleep(FADE + 30);
            cL.remove(); cR.remove();
            leftEye.style.transition = ''; rightEye.style.transition = '';
            busy = false;
        }
        async function doHappyEyes() {
            if (busy) return; busy = true;
            function makeHappyPath(eye) {
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const rx = eye.r * 0.85, lift = eye.r * 0.7;
                p.setAttribute('d', `M ${eye.cx - rx} ${eye.cy + lift * 0.3} Q ${eye.cx} ${eye.cy - lift} ${eye.cx + rx} ${eye.cy + lift * 0.3}`);
                p.setAttribute('fill', 'none');
                p.setAttribute('stroke', 'var(--tl)');
                p.setAttribute('stroke-width', '9');
                p.setAttribute('stroke-linecap', 'round');
                p.style.opacity = '0';
                p.style.transition = `opacity ${FADE}ms ease`;
                return p;
            }
            const hL = makeHappyPath(L), hR = makeHappyPath(R);
            svg.appendChild(hL); svg.appendChild(hR);
            fadeEl(leftEye, '0', FADE); fadeEl(rightEye, '0', FADE);
            await sleep(FADE);
            hL.style.opacity = '1'; hR.style.opacity = '1';
            await sleep(800);
            hL.style.opacity = '0'; hR.style.opacity = '0';
            fadeEl(leftEye, '1', FADE); fadeEl(rightEye, '1', FADE);
            await sleep(FADE + 30);
            hL.remove(); hR.remove();
            leftEye.style.transition = ''; rightEye.style.transition = '';
            busy = false;
        }

        const BOT_ACTIONS = [
            { fn: doWink,               weight: 3 },
            { fn: doBlink,              weight: 2 },
            { fn: doDoubleBlink,        weight: 1 },
            { fn: () => doLook( 10, 0), weight: 2 },
            { fn: () => doLook(-10, 0), weight: 2 },
            { fn: doHappyEyes,          weight: 2 },
        ];

        function pickWeighted(list) {
            const total = list.reduce((s, a) => s + a.weight, 0);
            let r = Math.random() * total;
            for (const a of list) { r -= a.weight; if (r <= 0) return a.fn; }
            return list[0].fn;
        }
        function scheduleBot() {
            const delay = 2000 + Math.random() * 1500;
            setTimeout(async () => { await pickWeighted(BOT_ACTIONS)(); scheduleBot(); }, delay);
        }

        // ── Nombre: glitch ──
        const logoName = document.querySelector('.m-logo-name');
        let nameBusy = false;

        async function doGlitch() {
            if (nameBusy) return; nameBusy = true;
            const original    = 'iquín Soluciones';
            const glitchChars = '█▓▒░#@!?$%&';
            let iter = 0; const maxIter = 10;
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    const glitched = original.split('').map((ch, i) =>
                        i < iter / maxIter * original.length
                            ? ch
                            : (Math.random() > 0.6 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : ch)
                    ).join('');
                    logoName.childNodes.forEach(node => {
                        if (node.nodeType === 3) node.textContent = glitched;
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

        function scheduleName() {
            const delay = 7000 + Math.random() * 9000;
            setTimeout(async () => { await doGlitch(); scheduleName(); }, delay);
        }

        // Arrancar todo después del draw inicial
        setTimeout(() => { scheduleBot(); scheduleName(); }, 3200);
    });
    


  
    (function(){
        document.querySelectorAll('.m-faq-item').forEach(item => {
            const btn   = item.querySelector('.m-faq-q');
            const panel = item.querySelector('.m-faq-a');
            const icon  = item.querySelector('.m-faq-icon');
            btn.addEventListener('click', () => {
                const isOpen = item.dataset.open === 'true';
                document.querySelectorAll('.m-faq-item').forEach(other => {
                    other.dataset.open = 'false';
                    other.querySelector('.m-faq-a').style.maxHeight = '0';
                    other.querySelector('.m-faq-icon').textContent = '+';
                    other.classList.remove('m-faq-item--open');
                });
                if (!isOpen) {
                    item.dataset.open = 'true';
                    item.classList.add('m-faq-item--open');
                    panel.style.maxHeight = panel.querySelector('.m-faq-a-inner').scrollHeight + 'px';
                    icon.textContent = '−';
                }
            });
        });
    })();
    