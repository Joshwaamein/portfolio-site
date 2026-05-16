/* =====================================================================
 * Joshua Mein — Portfolio
 * Tabs, theme/a11y/rain toggles, project rendering, deep-dive modal.
 * No build step. No framework. Vanilla JS.
 * ===================================================================== */

(function () {
    'use strict';

    const root = document.documentElement;
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    /* ----------------------------- Tabs ----------------------------- */
    // Only internal tabs (with data-tab) — skips external links like the Blog tab.
    function showTab(id) {
        $$('.nav-tab[data-tab]').forEach(b => {
            const active = b.dataset.tab === id;
            b.classList.toggle('active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        $$('.tab-content').forEach(s => s.classList.toggle('active', s.id === `tab-${id}`));
        if (history.replaceState) history.replaceState(null, '', `#${id}`);
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }

    $$('.nav-tab[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });

    // Logo click → about
    const logo = $('.logo');
    if (logo) {
        logo.addEventListener('click', e => {
            e.preventDefault();
            showTab('about');
        });
    }

    // Initial tab from URL hash (?#projects etc.)
    (function initialTab() {
        const validIds = new Set(['about', 'projects', 'experience', 'contact']);
        const hash = (location.hash || '').replace('#', '');
        if (validIds.has(hash)) showTab(hash);
    })();

    /* ------------------------- Theme toggle ------------------------- */
    const themeToggle = $('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
        });
    }

    /* -------------------------- A11y toggle ------------------------- */
    const a11yToggle = $('#a11y-toggle');
    if (a11yToggle) {
        a11yToggle.addEventListener('click', () => {
            const on = root.getAttribute('data-a11y') === 'true';
            if (on) {
                root.removeAttribute('data-a11y');
                localStorage.setItem('a11y', 'false');
            } else {
                root.setAttribute('data-a11y', 'true');
                localStorage.setItem('a11y', 'true');
            }
        });
    }

    /* -------------------------- Rain toggle ------------------------- */
    const rainToggle = $('#rain-toggle');
    if (rainToggle) {
        rainToggle.addEventListener('click', () => {
            const off = root.getAttribute('data-rain') === 'off';
            if (off) {
                root.removeAttribute('data-rain');
                localStorage.setItem('rain', 'true');
            } else {
                root.setAttribute('data-rain', 'off');
                localStorage.setItem('rain', 'false');
            }
        });
    }

    /* -------------------------- Footer year ------------------------- */
    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ----------------------- Render projects ------------------------ */
    function renderProjects() {
        const grid = $('#projects-grid');
        if (!grid || !window.PROJECTS) return;
        const html = window.PROJECTS.map(p => projectCardHtml(p)).join('\n');
        grid.innerHTML = html;

        $$('.project-card.clickable', grid).forEach(card => {
            card.addEventListener('click', e => {
                if (e.target.closest('a')) return; // let inline links pass through
                const id = card.dataset.project;
                openProjectModal(id);
            });
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const id = card.dataset.project;
                    openProjectModal(id);
                }
            });
        });
    }

    function projectCardHtml(p) {
        const featured = p.featured ? ' featured' : '';
        const tech = (p.tech || []).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
        const links = (p.links || []).map(l =>
            `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener" class="project-link" onclick="event.stopPropagation()">${escapeHtml(l.label)}</a>`
        ).join('');
        const hint = p.deepDive ? `<span class="project-dive-hint">Click for development deep dive</span>` : '';
        return `
        <article class="project-card clickable${featured}" data-project="${escapeHtml(p.id)}" tabindex="0" role="button" aria-label="Open deep dive for ${escapeHtml(p.name)}">
            <div class="project-header">
                <span class="project-icon" aria-hidden="true">${p.icon || '🛠️'}</span>
                <h3 class="project-name">${escapeHtml(p.name)}</h3>
            </div>
            <p class="project-description">${escapeHtml(p.description)}</p>
            <div class="project-tech">${tech}</div>
            <div class="project-links">${links}</div>
            ${hint}
        </article>`;
    }

    /* ------------------------- Modal logic -------------------------- */
    const modal = $('#project-modal');
    const modalContent = $('#modal-content');
    let lastFocus = null;

    function openProjectModal(id) {
        const p = (window.PROJECTS || []).find(x => x.id === id);
        if (!p) return;
        modalContent.innerHTML = renderProjectDeepDive(p);
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lastFocus = document.activeElement;
        const closeBtn = $('.modal-close', modal);
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target.matches('[data-close]')) closeModal();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });
    }

    function renderProjectDeepDive(p) {
        const dd = p.deepDive || {};
        const sections = [];

        sections.push(`<h2>${escapeHtml(p.icon || '')} ${escapeHtml(p.name)}</h2>`);
        sections.push(`<p>${escapeHtml(p.description)}</p>`);

        if (p.tech && p.tech.length) {
            sections.push(`<div class="project-tech" style="margin: 0.5rem 0 1.25rem;">${
                p.tech.map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('')
            }</div>`);
        }

        if (dd.problem) {
            sections.push(`<h3>The Problem</h3><p>${dd.problem}</p>`);
        }
        if (dd.architecture && dd.architecture.length) {
            sections.push(`<h3>Architecture & Approach</h3><ul>${
                dd.architecture.map(li => `<li>${li}</li>`).join('')
            }</ul>`);
        }
        if (dd.highlights && dd.highlights.length) {
            sections.push(`<h3>Highlights</h3><ul>${
                dd.highlights.map(li => `<li>${li}</li>`).join('')
            }</ul>`);
        }
        if (dd.takeaways) {
            sections.push(`<h3>Takeaways</h3><p>${dd.takeaways}</p>`);
        }

        if (p.links && p.links.length) {
            sections.push(`<h3>Links</h3><div class="project-links" style="margin-top:0.25rem">${
                p.links.map(l => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener" class="project-link">${escapeHtml(l.label)} ↗</a>`).join('')
            }</div>`);
        }

        return sections.join('\n');
    }

    renderProjects();
})();
