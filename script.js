/* ==========================================================================
   BLACK & WHITE ADVERTISING SOLUTIONS - CONTACT US
   VANILLA JAVASCRIPT LOGIC & INTERACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       01. GLOBAL DOM ELEMENTS & STATE
       ---------------------------------------------------------------------- */
    const isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Intro Overlay Elements
    const introOverlay = document.getElementById('cinematic-intro');
    const introCanvas = document.getElementById('intro-canvas');
    const skipIntroBtn = document.getElementById('skip-intro');
    const introGlow = document.querySelector('.intro-glow');
    const introLogoWrap = document.getElementById('intro-logo-wrap');
    const introHeadlineText = document.getElementById('intro-headline-text');
    const introRedLine = document.getElementById('intro-red-line');
    const introTagline = document.getElementById('intro-tagline');
    const introCurtain = document.getElementById('intro-curtain');
    const mainWrapper = document.getElementById('main-wrapper');

    // Cursor Elements
    const cursorDot = document.getElementById('custom-cursor');
    const cursorRing = document.getElementById('cursor-follower');
    const ambientGlow = document.getElementById('ambient-glow');

    // Mouse Tracking State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let introCanvasCtx = null;
    let bgCanvasCtx = null;
    let introAnimId = null;
    let bgAnimId = null;

    /* ----------------------------------------------------------------------
       02. CINEMATIC INTRO TIMELINE & ANIMATION
       ---------------------------------------------------------------------- */
    let introLines = [];
    let introParticles = [];
    let introStartTime = performance.now();

    function initIntroCanvas() {
        if (!introCanvas) return;
        introCanvas.width = window.innerWidth;
        introCanvas.height = window.innerHeight;
        introCanvasCtx = introCanvas.getContext('2d');

        // Create controlled motion lines
        introLines = [
            { x1: 0, y1: window.innerHeight * 0.3, x2: window.innerWidth, y2: window.innerHeight * 0.3, progress: 0, speed: 0.015, dir: 'h' },
            { x1: 0, y1: window.innerHeight * 0.7, x2: window.innerWidth, y2: window.innerHeight * 0.7, progress: 0, speed: 0.012, dir: 'h' },
            { x1: window.innerWidth * 0.25, y1: 0, x2: window.innerWidth * 0.25, y2: window.innerHeight, progress: 0, speed: 0.018, dir: 'v' },
            { x1: window.innerWidth * 0.75, y1: 0, x2: window.innerWidth * 0.75, y2: window.innerHeight, progress: 0, speed: 0.014, dir: 'v' }
        ];

        // Create subtle red particles
        introParticles = Array.from({ length: isMobile ? 12 : 28 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            speedY: -(Math.random() * 0.3 + 0.1),
            opacity: Math.random() * 0.35 + 0.1,
            pulse: Math.random() * 0.015 + 0.005,
            pulseDir: 1
        }));
    }

    function renderIntroCanvas(timestamp) {
        if (!introCanvasCtx) return;
        introCanvasCtx.clearRect(0, 0, introCanvas.width, introCanvas.height);

        const elapsed = (timestamp - introStartTime) / 1000;

        // 0.8s - 5.5s: Draw Motion Lines
        if (elapsed >= 0.8 && elapsed <= 5.5) {
            introCanvasCtx.lineWidth = 1;
            introLines.forEach(line => {
                if (line.progress < 1) line.progress += line.speed;
                introCanvasCtx.strokeStyle = 'rgba(225, 6, 0, 0.35)';
                introCanvasCtx.shadowColor = '#E10600';
                introCanvasCtx.shadowBlur = 6;
                introCanvasCtx.beginPath();
                introCanvasCtx.moveTo(line.x1, line.y1);

                if (line.dir === 'h') {
                    introCanvasCtx.lineTo(line.x1 + (line.x2 - line.x1) * line.progress, line.y1);
                } else {
                    introCanvasCtx.lineTo(line.x1, line.y1 + (line.y2 - line.y1) * line.progress);
                }
                introCanvasCtx.stroke();
            });
        }

        // 1.5s - 5.5s: Draw Particles
        if (elapsed >= 1.5 && elapsed <= 5.5) {
            introParticles.forEach(p => {
                p.y += p.speedY;
                if (p.y < 0) p.y = introCanvas.height;

                p.opacity += p.pulse * p.pulseDir;
                if (p.opacity > 0.55 || p.opacity < 0.1) p.pulseDir *= -1;

                introCanvasCtx.fillStyle = `rgba(225, 6, 0, ${p.opacity.toFixed(2)})`;
                introCanvasCtx.shadowColor = '#E10600';
                introCanvasCtx.shadowBlur = 5;
                introCanvasCtx.beginPath();
                introCanvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                introCanvasCtx.fill();
            });
        }

        if (introOverlay && introOverlay.style.display !== 'none') {
            introAnimId = requestAnimationFrame(renderIntroCanvas);
        }
    }

    function runCinematicIntroTimeline() {
        initIntroCanvas();
        introStartTime = performance.now();
        introAnimId = requestAnimationFrame(renderIntroCanvas);

        // 0.0 - 0.8s: Subtle Red Glow in Center
        setTimeout(() => {
            if (introGlow) introGlow.classList.add('glow-active');
        }, 300);

        // 2.2s: Logo Appears
        setTimeout(() => {
            if (introLogoWrap) introLogoWrap.classList.add('logo-active');
        }, 2200);

        // 3.0s: Logo moves upward, CONTACT US reveals smoothly as ONE line
        setTimeout(() => {
            if (introLogoWrap) introLogoWrap.classList.add('logo-shift');

            if (introHeadlineText) {
                introHeadlineText.style.opacity = '1';
                introHeadlineText.style.transform = 'translateY(0)';
            }
        }, 3000);

        // 3.8s: Thin red line underneath grows width
        setTimeout(() => {
            if (introRedLine) {
                introRedLine.style.width = isMobile ? '100px' : '160px';
            }
        }, 3800);

        // 4.5s: Tagline reveal
        setTimeout(() => {
            if (introTagline) introTagline.classList.add('tagline-active');
        }, 4500);

        // 5.5s: Outro fade transition out
        setTimeout(() => {
            if (introLogoWrap) introLogoWrap.style.opacity = '0';
            if (introHeadlineText) introHeadlineText.style.opacity = '0';
            if (introRedLine) introRedLine.style.opacity = '0';
            if (introTagline) introTagline.style.opacity = '0';
            if (introGlow) introGlow.style.opacity = '0';
        }, 5500);

        // 6.2s: Black Curtain Sweep
        setTimeout(() => {
            if (introCurtain) introCurtain.classList.add('curtain-sweep');
        }, 6200);

        // 6.8s: Complete Intro, Show Main Page
        setTimeout(() => {
            finishIntroSequence();
        }, 6800);
    }

    function finishIntroSequence() {
        if (introAnimId) cancelAnimationFrame(introAnimId);
        if (introOverlay) {
            introOverlay.style.display = 'none';
        }
        if (mainWrapper) {
            mainWrapper.classList.add('loaded');
        }
        initScrollObservers();
    }

    if (skipIntroBtn) {
        skipIntroBtn.addEventListener('click', () => {
            finishIntroSequence();
        });
    }

    // Start intro sequence
    runCinematicIntroTimeline();


    /* ----------------------------------------------------------------------
       03. CUSTOM CURSOR & AMBIENT MOUSE GLOW
       ---------------------------------------------------------------------- */
    function updateMousePosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }

        if (ambientGlow) {
            ambientGlow.style.left = `${mouseX}px`;
            ambientGlow.style.top = `${mouseY}px`;
        }
    }

    function animateCursorRing() {
        if (!isMobile && cursorRing) {
            // Smooth LERP (Linear Interpolation)
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(animateCursorRing);
    }

    if (!isMobile) {
        window.addEventListener('mousemove', updateMousePosition);
        requestAnimationFrame(animateCursorRing);

        // Interactive Hover Targets for Cursor Expansion
        const hoverExpandTargets = document.querySelectorAll('.hover-expand');
        hoverExpandTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                if (cursorDot) cursorDot.classList.add('expand');
                if (cursorRing) cursorRing.classList.add('expand');
            });
            target.addEventListener('mouseleave', () => {
                if (cursorDot) cursorDot.classList.remove('expand');
                if (cursorRing) cursorRing.classList.remove('expand');
            });
        });
    }


    /* ----------------------------------------------------------------------
       04. LIVING BACKGROUND AMBIENT CANVAS PARTICLES
       ---------------------------------------------------------------------- */
    const bgCanvas = document.getElementById('bg-canvas');
    let bgParticles = [];

    function initBgCanvas() {
        if (!bgCanvas) return;
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        bgCanvasCtx = bgCanvas.getContext('2d');

        bgParticles = Array.from({ length: isMobile ? 10 : 25 }, () => ({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            radius: Math.random() * 1.5 + 0.5,
            speedY: -(Math.random() * 0.3 + 0.05),
            speedX: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.3 + 0.05
        }));
    }

    function renderBgCanvas() {
        if (!bgCanvasCtx) return;
        bgCanvasCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

        bgParticles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y < 0) p.y = bgCanvas.height;
            if (p.x < 0) p.x = bgCanvas.width;
            if (p.x > bgCanvas.width) p.x = 0;

            bgCanvasCtx.fillStyle = `rgba(225, 6, 0, ${p.opacity.toFixed(2)})`;
            bgCanvasCtx.beginPath();
            bgCanvasCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            bgCanvasCtx.fill();
        });

        bgAnimId = requestAnimationFrame(renderBgCanvas);
    }

    initBgCanvas();
    requestAnimationFrame(renderBgCanvas);

    window.addEventListener('resize', () => {
        if (bgCanvas) {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        }
        if (introCanvas) {
            introCanvas.width = window.innerWidth;
            introCanvas.height = window.innerHeight;
        }
    });


    /* ----------------------------------------------------------------------
       05. SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)
       ---------------------------------------------------------------------- */
    function initScrollObservers() {
        const revealElements = document.querySelectorAll('.reveal-item, .reveal-cta');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -30px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));

        // CTA Sweep Line Trigger
        const ctaSection = document.getElementById('cta');
        const ctaSweepLine = document.getElementById('cta-sweep-line');

        if (ctaSection && ctaSweepLine) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        ctaSweepLine.classList.add('sweep-active');
                    }
                });
            }, { threshold: 0.2 });

            ctaObserver.observe(ctaSection);
        }
    }

});
