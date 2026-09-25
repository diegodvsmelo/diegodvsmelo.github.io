document.documentElement.classList.add("js");
const siteData = window.siteData;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
}

const skillIcons = {
    unity: '<path d="M12 2 3.5 7v10L12 22l8.5-5V7L12 2Z"/><path d="m3.5 7 8.5 5 8.5-5M12 12v10"/>',
    code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 4l-4 16"/>',
    gamepad: '<path d="M7 8h10a4 4 0 0 1 3.9 3.1l1 5a2.5 2.5 0 0 1-4 2.5L15 16H9l-2.9 2.6a2.5 2.5 0 0 1-4-2.5l1-5A4 4 0 0 1 7 8Z"/><path d="M7 11v4m-2-2h4m7-1h.01M18 14h.01"/>',
    blocks: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M17 13v8m-4-4h8"/>',
    flow: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="11" cy="19" r="2"/><path d="M7 5h5a5 5 0 0 1 5 5v1M5 7v5a7 7 0 0 0 5 6"/>',
    speed: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="m12 14 4-5M7 18h10M12 4v2M4.5 10l1.6 1M19.5 10l-1.6 1"/>',
    git: '<circle cx="6" cy="4" r="2"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 6v12M6 11h5a7 7 0 0 0 7-2"/>',
    ui: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h5M8 16h8"/>',
    shader: '<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z"/><path d="M18 3v3M16.5 4.5h3M5 18v3M3.5 19.5h3"/>',
    cpp: '<path d="M15 5a8 8 0 1 0 0 14M16 11v6m-3-3h6m3-3v6m-3-3h5"/>',
    design: '<path d="M4 6h16M4 12h10M4 18h16"/><circle cx="17" cy="12" r="3"/>'
};

const artSymbols = {
    codice: '<circle cx="80" cy="80" r="55" opacity=".4"/><circle cx="80" cy="80" r="40" opacity=".7"/><path d="m80 35 13 30 30 15-30 15-13 30-13-30-30-15 30-15 13-30Z" fill="currentColor" fill-opacity=".18"/><path d="M80 21v12M80 127v12M21 80h12M127 80h12"/><path d="m45 45 9 9m52 52 9 9m0-70-9 9m-52 52-9 9"/>',
    eita: '<path d="M29 121h102M40 119V75l25-20 25 20v44M48 80h15v15H48zM95 119V50l24-14 12 9v74M103 62h12v12h-12zM103 84h12v12h-12z"/><path d="M77 119V92h13M28 81c-5-18 5-31 24-34-3 18-10 29-24 34ZM27 82v37"/><circle cx="121" cy="29" r="10" fill="currentColor" fill-opacity=".25"/>',
    capiba: '<circle cx="80" cy="80" r="58" fill="currentColor" fill-opacity=".12"/><circle cx="80" cy="80" r="47"/><path d="M98 59a29 29 0 1 0 0 42M70 73c8-10 21-12 31-5M70 87c8 10 21 12 31 5"/><path d="M35 48 25 38m110 84 10 10M31 113l-12 6m122-78 11-8"/>',
    route: '<path d="M27 119c24-9 35-38 55-39 24-2 19 29 49 4" stroke-width="6" stroke-dasharray="9 8"/><path d="M28 40c20-15 38-15 55 2 15 15 31 14 50-2" opacity=".5"/><circle cx="27" cy="119" r="10" fill="currentColor" fill-opacity=".25"/><circle cx="82" cy="80" r="10" fill="currentColor" fill-opacity=".25"/><circle cx="131" cy="84" r="10" fill="currentColor" fill-opacity=".25"/><path d="M26 63h19m-9-9v19M102 113h25"/>',
    market: '<rect x="25" y="28" width="110" height="104" rx="10" fill="currentColor" fill-opacity=".1"/><path d="M25 55h110M42 76h30M42 88h45M42 105h13v14H42zM64 96h13v23H64zM86 83h13v36H86zM108 70h13v49h-13z"/><circle cx="42" cy="42" r="3" fill="currentColor"/><circle cx="53" cy="42" r="3" fill="currentColor"/>',
    homes: '<path d="m22 76 58-47 58 47v55H22V76Z" fill="currentColor" fill-opacity=".12"/><path d="m22 76 58-47 58 47M34 68v63h92V68M65 131V93h30v38M43 88h13v14H43zM104 88h13v14h-13z"/><path d="M38 46V29h21v5"/>'
};

function renderSkills() {
    const grid = document.getElementById("skills-grid");
    grid.innerHTML = siteData.skills.map((skill) => `
        <article class="skill-card">
            <div class="skill-orbit" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${skillIcons[skill.icon] || skillIcons.code}</svg>
            </div>
            <h3>${escapeHtml(skill.title)}</h3>
            <p>${escapeHtml(skill.description)}</p>
        </article>
    `).join("");
    document.getElementById("skills-count").textContent = String(siteData.skills.length).padStart(2, "0");
}

function safeProjectLink(rawLink) {
    try {
        const url = new URL(rawLink);
        return ["https:", "mailto:"].includes(url.protocol) ? rawLink : `mailto:${siteData.contactEmail}`;
    } catch {
        return `mailto:${siteData.contactEmail}`;
    }
}

function renderProjects() {
    const grid = document.getElementById("projects-grid");
    grid.innerHTML = siteData.projects.map((project) => {
        const art = artSymbols[project.visual] || artSymbols.codice;

        return `
            <article class="project-card">
                <div class="project-art project-art--${escapeHtml(project.visual)}" aria-hidden="true">
                    <div class="art-topbar"><i></i><i></i><i></i></div>
                    <div class="art-window"></div>
                    <div class="art-copy"><span class="art-overline">${escapeHtml(project.category)}</span><span class="art-name">${escapeHtml(project.visualTitle || project.title)}</span></div>
                    <div class="art-lines"><span></span><span></span></div>
                    <div class="art-symbol"><svg viewBox="0 0 160 160" aria-hidden="true">${art}</svg></div>
                </div>
                <div class="project-tags">${project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
                <span class="project-category">${escapeHtml(project.category)} · ${escapeHtml(project.period)}</span>
                <h3><button class="project-card-trigger" type="button" data-open-project="${escapeHtml(project.visual)}" aria-haspopup="dialog" aria-controls="project-dialog" aria-label="Ver detalhes de ${escapeHtml(project.title)}">${escapeHtml(project.title)}</button></h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <span class="project-visit" aria-hidden="true">Ver detalhes <span>+</span></span>
            </article>
        `;
    }).join("");
}

function renderProjectDetails(project) {
    const details = project.details || {};
    const highlights = Array.isArray(details.highlights) ? details.highlights : [];
    const technologies = Array.isArray(details.technologies) && details.technologies.length ? details.technologies : project.stack;
    const competencies = Array.isArray(details.competencies) ? details.competencies : [];
    const hasProcess = highlights.some((item) => item.how || item.why);
    const link = safeProjectLink(project.link);
    const isRepository = link.startsWith("https:");
    const linkLabel = isRepository ? "Abrir repositório" : "Conversar sobre o projeto";
    const linkAttrs = isRepository ? ' target="_blank" rel="noopener noreferrer"' : "";

    return `
        <p class="detail-intro">${escapeHtml(details.context || project.description)}</p>
        ${details.role ? `<p class="detail-role"><strong>Atuação:</strong> ${escapeHtml(details.role)}</p>` : ""}
        ${highlights.length ? `<section class="detail-section" aria-labelledby="detail-highlights-title">
            <h3 id="detail-highlights-title">${hasProcess ? "Principais responsabilidades e entregas" : "Pontos do projeto"}</h3>
            <div class="detail-grid">${highlights.map((item) => `<article class="detail-card">
                <h4>${escapeHtml(item.title)}</h4>
                <p><strong>${hasProcess ? "Entrega:" : "Destaque:"}</strong> ${escapeHtml(item.delivery)}</p>
                ${item.how ? `<p><strong>Como:</strong> ${escapeHtml(item.how)}</p>` : ""}
                ${item.why ? `<p><strong>Por quê:</strong> ${escapeHtml(item.why)}</p>` : ""}
            </article>`).join("")}</div>
        </section>` : ""}
        <section class="detail-section" aria-labelledby="detail-tech-title"><h3 id="detail-tech-title">Tecnologias e abordagens</h3><div class="detail-chips">${technologies.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></section>
        ${competencies.length ? `<section class="detail-section" aria-labelledby="detail-skills-title"><h3 id="detail-skills-title">Competências envolvidas</h3><div class="detail-chips">${competencies.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></section>` : ""}
        <div class="detail-footer"><a class="button button--primary" href="${escapeHtml(link)}"${linkAttrs}>${linkLabel} <span aria-hidden="true">↗</span></a>${!isRepository ? "<p>Este link abre seu aplicativo de email para conversar sobre o projeto.</p>" : ""}</div>
    `;
}

function setupProjectDialog() {
    const dialog = document.getElementById("project-dialog");
    const closeButton = document.getElementById("project-dialog-close");
    const content = document.getElementById("project-dialog-content");
    let previousFocus = null;

    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-open-project]");
        if (!trigger) return;
        const project = siteData.projects.find((item) => item.visual === trigger.dataset.openProject);
        if (!project) return;
        previousFocus = trigger;
        document.getElementById("project-dialog-category").textContent = project.category;
        document.getElementById("project-dialog-title").textContent = project.title;
        document.getElementById("project-dialog-period").textContent = project.period;
        content.innerHTML = renderProjectDetails(project);
        content.scrollTop = 0;
        dialog.showModal();
        document.body.classList.add("modal-open");
        closeButton.focus();
    });
    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
        document.body.classList.remove("modal-open");
        previousFocus?.focus();
    });
}

function setupMobileMenu() {
    const button = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-nav");

    function closeMenu() {
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Abrir menu");
        menu.hidden = true;
    }

    button.addEventListener("click", () => {
        const willOpen = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(willOpen));
        button.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
        menu.hidden = !willOpen;
    });
    menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !menu.hidden) {
            closeMenu();
            button.focus();
        }
    });
    document.addEventListener("click", (event) => {
        if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) closeMenu();
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 720 && !menu.hidden) closeMenu();
    });
}

function setupClickJuice() {
    document.addEventListener("pointerdown", (event) => {
        const control = event.target.closest("a, button");
        const target = control?.closest(".project-card") || control;
        if (target && !reducedMotion.matches) target.classList.add("juice-squash");
    });
    for (const eventName of ["pointerup", "pointercancel"]) {
        document.addEventListener(eventName, () => {
            document.querySelectorAll(".juice-squash").forEach((target) => target.classList.remove("juice-squash"));
        });
    }
    document.addEventListener("keydown", (event) => {
        if (event.repeat || !["Enter", " "].includes(event.key)) return;
        const control = event.target.closest("a, button");
        const target = control?.closest(".project-card") || control;
        if (target && !reducedMotion.matches) target.classList.add("juice-squash");
    });
    document.addEventListener("keyup", () => {
        document.querySelectorAll(".juice-squash").forEach((target) => target.classList.remove("juice-squash"));
    });
    document.addEventListener("click", (event) => {
        const control = event.target.closest("a, button");
        const target = control?.closest(".project-card") || control;
        if (!target || reducedMotion.matches) return;
        target.classList.remove("juice-squash");
        target.classList.remove("juice-pop");
        void target.offsetWidth;
        target.classList.add("juice-pop");
        target.addEventListener("animationend", () => target.classList.remove("juice-pop"), { once: true });
    }, true);
}

if (siteData) {
    renderSkills();
    renderProjects();
    setupProjectDialog();
}
setupMobileMenu();
setupClickJuice();
document.getElementById("year").textContent = new Date().getFullYear();
