/* =====================================================================
 * Matrix-style digital rain background.
 * Lightweight: single canvas, requestAnimationFrame, throttled to ~30fps.
 * Respects prefers-reduced-motion and the [data-rain="off"] flag.
 * ===================================================================== */

(function () {
    'use strict';

    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Glyph set: katakana + ASCII digits + a few symbols
    const GLYPHS = (
        'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        '0123456789' +
        '$+-*/=%"\'#&_(){}[]<>:;.,'
    ).split('');

    const FONT_SIZE = 16;
    const TARGET_FPS = 30;
    const FRAME_MS = 1000 / TARGET_FPS;

    let columns = 0;
    let drops = [];          // y position of each column's leading char
    let speeds = [];         // randomised speed per column
    let dpr = 1;
    let running = true;
    let lastFrame = 0;
    let rafId = null;

    function getAccent() {
        const v = getComputedStyle(root).getPropertyValue('--accent').trim();
        return v || '#00ff41';
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width  = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width  = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        columns = Math.ceil(w / FONT_SIZE);
        drops = new Array(columns).fill(0).map(() => Math.random() * -50);
        speeds = new Array(columns).fill(0).map(() => 0.5 + Math.random() * 0.7);
    }

    function draw(ts) {
        if (!running) return;
        rafId = requestAnimationFrame(draw);

        if (ts - lastFrame < FRAME_MS) return;
        lastFrame = ts;

        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        // Trail-fade. Pull bg colour from CSS so light/dark both work.
        const bg = getComputedStyle(root).getPropertyValue('--bg').trim() || '#0d1117';
        ctx.fillStyle = hexToRgba(bg, 0.08);
        ctx.fillRect(0, 0, w, h);

        const accent = getAccent();
        ctx.font = `${FONT_SIZE}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.textBaseline = 'top';

        for (let i = 0; i < columns; i++) {
            const x = i * FONT_SIZE;
            const y = drops[i] * FONT_SIZE;
            const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];

            // Brighter head, dimmer tail
            ctx.fillStyle = accent;
            ctx.shadowBlur = 6;
            ctx.shadowColor = accent;
            ctx.fillText(ch, x, y);
            ctx.shadowBlur = 0;

            // Reset to top with random offset when off-screen
            if (y > h && Math.random() > 0.965) {
                drops[i] = -Math.random() * 20;
            } else {
                drops[i] += speeds[i];
            }
        }
    }

    // Helpers
    function hexToRgba(hex, alpha) {
        hex = hex.replace('#', '').trim();
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const r = parseInt(hex.slice(0, 2), 16) || 0;
        const g = parseInt(hex.slice(2, 4), 16) || 0;
        const b = parseInt(hex.slice(4, 6), 16) || 0;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    function start() {
        if (rafId) return;
        running = true;
        lastFrame = 0;
        rafId = requestAnimationFrame(draw);
    }
    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        // Clear so the canvas doesn't keep showing the last frame when toggled off
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function shouldRun() {
        if (reducedMotion.matches) return false;
        if (root.getAttribute('data-rain') === 'off') return false;
        if (root.getAttribute('data-a11y') === 'true') return false;
        if (document.hidden) return false;
        return true;
    }

    function syncRunning() {
        if (shouldRun()) start();
        else stop();
    }

    // Wire events
    window.addEventListener('resize', () => { resize(); }, { passive: true });
    document.addEventListener('visibilitychange', syncRunning);
    if (reducedMotion.addEventListener) {
        reducedMotion.addEventListener('change', syncRunning);
    }

    // Watch for theme/a11y/rain changes
    const mo = new MutationObserver(syncRunning);
    mo.observe(root, { attributes: true, attributeFilter: ['data-rain', 'data-a11y', 'data-theme'] });

    // Init
    resize();
    syncRunning();
})();
