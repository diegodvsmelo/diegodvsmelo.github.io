document.documentElement.classList.add("js");
const siteData = window.siteData;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const originalTitle = document.title;
const descriptionMeta = document.querySelector('meta[name="description"]');
const originalDescription = descriptionMeta?.content;
let currentLanguage = "pt";
let copyStatusKey = "";
let projectDialogTrigger = null;
let restoreFocusAfterDialogClose = true;

const uiText = {
    pt: {
        viewDetails: "Ver detalhes",
        viewDetailsOf: "Ver detalhes de",
        openRepository: "Abrir repositório",
        talkAboutProject: "Conversar sobre o projeto",
        role: "Atuação:",
        responsibilities: "Principais responsabilidades e entregas",
        projectHighlights: "Pontos do projeto",
        delivery: "Entrega:",
        highlight: "Destaque:",
        how: "Como:",
        why: "Por quê:",
        technologies: "Tecnologias e abordagens",
        competencies: "Competências envolvidas",
        mailProjectHint: "Este link tenta abrir seu aplicativo de email para conversar sobre o projeto.",
        menuOpen: "Abrir menu",
        menuClose: "Fechar menu",
        mailFallbackMessage: "Se nada abriu, copie o endereço e envie a mensagem pelo serviço de email que você usa.",
        emailCopied: "Email copiado.",
        emailCopyFailed: "Não foi possível copiar automaticamente. Selecione o endereço acima."
    },
    en: {
        pageTitle: "Diego Davis Melo | Unity Developer",
        pageDescription: "Portfolio of Diego Davis Melo, Unity developer and BFI-10 fellow at UFPE/FACEPE, focused on games, interfaces, and interactive systems.",
        skipLink: "Skip to content",
        mainNavigation: "Main navigation",
        brandLabel: "Diego Davis Melo, back to the top",
        navProjects: "Projects",
        navExperience: "Experience",
        navAbout: "About",
        navContact: "Contact",
        navSkills: "Skills",
        languageGroup: "Site language",
        mobileNavigation: "Mobile navigation",
        profileAlt: "Photo of Diego Davis Melo",
        heroGreeting: "Hi, I'm",
        heroTitle: "Game developer",
        heroTitleAccent: "& interactive systems.",
        heroDescription: "Information Systems undergraduate at UFPE. I develop games in Unity and C#, focusing on progression, interfaces, and modular architecture.",
        exploreProjects: "Explore projects",
        moreAbout: "More about me",
        socialLinks: "Diego's links",
        findMe: "Find me",
        githubLabel: "Diego Davis Melo's GitHub, opens in a new tab",
        emailLabel: "Email",
        emailLinkLabel: "Email Diego Davis Melo",
        aboutEyebrow: "01 / About me",
        aboutTitle: "Ideas come to life ",
        aboutTitleAccent: "when they become games.",
        aboutDescriptionOne: "I work on digital games, interactive systems, and academic research. In Unity and C#, I develop progression mechanics, economies, interfaces, and tutorials.",
        aboutDescriptionTwo: "I organize code so each system can evolve clearly. My interests include 2D and 3D games, gameplay, systems design, and game design.",
        aboutCta: "Let's create something together",
        portfolioFacts: "Portfolio facts",
        projectsCountLabel: "Projects featured",
        skillsCountLabel: "Areas of expertise",
        graduationFact: "Expected graduation in Information Systems, CIn-UFPE",
        experienceEyebrow: "02 / Experience",
        experienceTitle: "From research to games.",
        experienceIntro: "Professional Unity development experience, supported by academic study and continued practice.",
        experienceBadge: "BFI-10 fellowship · UFPE/FACEPE",
        experiencePeriod: "Feb 2026 – Sep 2026",
        experienceRole: "Unity Developer",
        experiencePlace: "Laboratory for the Design and Analysis of Intelligent Artifacts (LaCA²I)",
        experienceDescription: "I worked on EITA!, an incremental mobile game about environmental education, as part of an initiative that also covers gamification, augmented reality, and accessible information. I developed game systems, progression, tutorials, and visual feedback.",
        experienceProjectCta: "Explore the EITA! project",
        academicLabel: "Education",
        academicTitle: "Information Systems",
        academicDescription: "CIn / Federal University of Pernambuco. Started in March 2025; 30% completed. Expected graduation in December 2028.",
        learningLabel: "Additional training",
        learningDescription: "Unity Essentials Pathway completed. Junior Programmer Pathway: 77% completed.",
        bookLabel: "Academic publication",
        bookTitle: "Academic book · 2025",
        bookDescription: "Coauthor of chapter 3 and technical reviewer of the other chapters of “Sistemas de Informação para Iniciantes – 2ª Edição”.",
        languagesLabel: "Languages",
        languagesTitle: "Portuguese and English",
        languagesDescription: "Native Portuguese. Advanced English reading and writing, with intermediate conversation skills.",
        skillsEyebrow: "03 / What I do",
        skillsTitle: "Core skills",
        skillsIntro: "From game logic to the structure that helps each idea grow.",
        interestsLabel: "Areas of interest",
        interestGames: "2D and 3D games",
        interestGameplay: "Gameplay and Systems Design",
        projectsEyebrow: "04 / Portfolio",
        projectsTitle: "Featured projects",
        projectsIntro: "Select a project to see its context, deliverables, and technologies.",
        viewGithub: "View GitHub",
        closeProject: "Close project details",
        mailHelpLabel: "Email help",
        closeMailHelp: "Close email help",
        copyEmail: "Copy email",
        footerEmail: "Email ↗",
        backToTop: "Back to top ↑",
        viewDetails: "View details",
        viewDetailsOf: "View details of",
        openRepository: "Open repository",
        talkAboutProject: "Ask about this project",
        role: "Role:",
        responsibilities: "Main responsibilities and deliverables",
        projectHighlights: "Project highlights",
        delivery: "Deliverable:",
        highlight: "Highlight:",
        how: "How:",
        why: "Why:",
        technologies: "Technologies and approaches",
        competencies: "Skills involved",
        mailProjectHint: "This link tries to open your email app to discuss the project.",
        menuOpen: "Open menu",
        menuClose: "Close menu",
        mailFallbackMessage: "If nothing opened, copy the address and send your message through the email service you use.",
        emailCopied: "Email copied.",
        emailCopyFailed: "Automatic copying failed. Select the address above."
    }
};

const staticText = [...document.querySelectorAll("[data-i18n]")].map((element) => {
    const node = [...element.childNodes].find((child) => child.nodeType === Node.TEXT_NODE && child.nodeValue.trim());
    return { element, node, original: node?.nodeValue };
});
const staticAttributes = ["aria-label", "alt"].flatMap((attribute) =>
    [...document.querySelectorAll(`[data-i18n-${attribute}]`)].map((element) => ({
        element, attribute, key: element.getAttribute(`data-i18n-${attribute}`), original: element.getAttribute(attribute)
    }))
);

function textFor(key) {
    return uiText[currentLanguage][key];
}

function contentForLanguage() {
    return siteData?.[currentLanguage];
}

function preferredLanguage() {
    try {
        const saved = localStorage.getItem("portfolio-language");
        if (saved === "pt" || saved === "en") return saved;
    } catch {
        // Browsers may block storage for local files or private sessions.
    }
    return navigator.language?.toLowerCase().startsWith("en") ? "en" : "pt";
}

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
    const skills = contentForLanguage().skills;
    grid.innerHTML = skills.map((skill) => `
        <article class="skill-card">
            <div class="skill-orbit" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${skillIcons[skill.icon] || skillIcons.code}</svg>
            </div>
            <h3>${escapeHtml(skill.title)}</h3>
            <p>${escapeHtml(skill.description)}</p>
        </article>
    `).join("");
    document.getElementById("skills-count").textContent = String(skills.length).padStart(2, "0");
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
    grid.innerHTML = contentForLanguage().projects.map((project) => {
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
                <h3><button class="project-card-trigger" type="button" data-open-project="${escapeHtml(project.visual)}" aria-haspopup="dialog" aria-controls="project-dialog" aria-label="${escapeHtml(textFor("viewDetailsOf"))} ${escapeHtml(project.title)}">${escapeHtml(project.title)}</button></h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <span class="project-visit" aria-hidden="true">${escapeHtml(textFor("viewDetails"))} <span>+</span></span>
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
    const linkLabel = isRepository ? textFor("openRepository") : textFor("talkAboutProject");
    const linkAttrs = isRepository ? ' target="_blank" rel="noopener noreferrer"' : "";

    return `
        <p class="detail-intro">${escapeHtml(details.context || project.description)}</p>
        ${details.role ? `<p class="detail-role"><strong>${escapeHtml(textFor("role"))}</strong> ${escapeHtml(details.role)}</p>` : ""}
        ${highlights.length ? `<section class="detail-section" aria-labelledby="detail-highlights-title">
            <h3 id="detail-highlights-title">${escapeHtml(hasProcess ? textFor("responsibilities") : textFor("projectHighlights"))}</h3>
            <div class="detail-grid">${highlights.map((item) => `<article class="detail-card">
                <h4>${escapeHtml(item.title)}</h4>
                <p><strong>${escapeHtml(hasProcess ? textFor("delivery") : textFor("highlight"))}</strong> ${escapeHtml(item.delivery)}</p>
                ${item.how ? `<p><strong>${escapeHtml(textFor("how"))}</strong> ${escapeHtml(item.how)}</p>` : ""}
                ${item.why ? `<p><strong>${escapeHtml(textFor("why"))}</strong> ${escapeHtml(item.why)}</p>` : ""}
            </article>`).join("")}</div>
        </section>` : ""}
        <section class="detail-section" aria-labelledby="detail-tech-title"><h3 id="detail-tech-title">${escapeHtml(textFor("technologies"))}</h3><div class="detail-chips">${technologies.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></section>
        ${competencies.length ? `<section class="detail-section" aria-labelledby="detail-skills-title"><h3 id="detail-skills-title">${escapeHtml(textFor("competencies"))}</h3><div class="detail-chips">${competencies.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></section>` : ""}
        <div class="detail-footer"><a class="button button--primary" href="${escapeHtml(link)}"${linkAttrs}>${escapeHtml(linkLabel)} <span aria-hidden="true">↗</span></a>${!isRepository ? `<p>${escapeHtml(textFor("mailProjectHint"))}</p>` : ""}</div>
    `;
}

function populateProjectDialog(project) {
    document.getElementById("project-dialog-category").textContent = project.category;
    document.getElementById("project-dialog-title").textContent = project.title;
    document.getElementById("project-dialog-period").textContent = project.period;
    const content = document.getElementById("project-dialog-content");
    content.innerHTML = renderProjectDetails(project);
    content.scrollTop = 0;
}

function setupProjectDialog() {
    const dialog = document.getElementById("project-dialog");
    const closeButton = document.getElementById("project-dialog-close");

    document.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-open-project]");
        if (!trigger) return;
        const project = contentForLanguage().projects.find((item) => item.visual === trigger.dataset.openProject);
        if (!project) return;
        projectDialogTrigger = trigger;
        dialog.dataset.project = project.visual;
        populateProjectDialog(project);
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
        if (restoreFocusAfterDialogClose && projectDialogTrigger?.isConnected) projectDialogTrigger.focus();
        restoreFocusAfterDialogClose = true;
    });
}

function setupMobileMenu() {
    const button = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-nav");

    function closeMenu() {
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", textFor("menuOpen"));
        menu.hidden = true;
    }

    button.addEventListener("click", () => {
        const willOpen = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(willOpen));
        button.setAttribute("aria-label", willOpen ? textFor("menuClose") : textFor("menuOpen"));
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

function setLanguage(language) {
    currentLanguage = language === "en" ? "en" : "pt";
    document.documentElement.lang = currentLanguage === "en" ? "en" : "pt-BR";
    document.title = currentLanguage === "en" ? uiText.en.pageTitle : originalTitle;
    if (descriptionMeta) {
        descriptionMeta.content = currentLanguage === "en" ? uiText.en.pageDescription : originalDescription;
    }

    staticText.forEach(({ element, node, original }) => {
        if (!node) return;
        const translated = currentLanguage === "en" ? uiText.en[element.dataset.i18n] : original;
        if (typeof translated === "string") node.nodeValue = translated;
    });
    staticAttributes.forEach(({ element, attribute, key, original }) => {
        const translated = currentLanguage === "en" ? uiText.en[key] : original;
        if (typeof translated === "string") element.setAttribute(attribute, translated);
    });
    document.querySelectorAll(".language-switcher [data-language]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
    });
    const menuButton = document.getElementById("menu-toggle");
    menuButton.setAttribute("aria-label", menuButton.getAttribute("aria-expanded") === "true" ? textFor("menuClose") : textFor("menuOpen"));

    if (contentForLanguage()) {
        renderSkills();
        renderProjects();
        const dialog = document.getElementById("project-dialog");
        if (dialog.open) {
            const project = contentForLanguage().projects.find((item) => item.visual === dialog.dataset.project);
            if (project) populateProjectDialog(project);
        }
    }

    const mailFallback = document.getElementById("mail-fallback");
    if (!mailFallback.hidden) {
        document.getElementById("mail-fallback-message").textContent = textFor("mailFallbackMessage");
    }
    if (copyStatusKey) {
        document.getElementById("mail-copy-status").textContent = textFor(copyStatusKey);
    }
}

function setupLanguageSwitcher() {
    document.querySelectorAll(".language-switcher [data-language]").forEach((button) => {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.language);
            try {
                localStorage.setItem("portfolio-language", currentLanguage);
            } catch {
                // The switch still works when local storage is unavailable.
            }
        });
    });
}

function copyEmailWithFallback(email) {
    const field = document.createElement("textarea");
    field.value = email;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
        return document.execCommand("copy");
    } finally {
        field.remove();
    }
}

function setupMailFallback() {
    const fallback = document.getElementById("mail-fallback");
    const message = document.getElementById("mail-fallback-message");
    const status = document.getElementById("mail-copy-status");
    const copyButton = document.getElementById("copy-email");
    let returnFocus = null;

    function closeFallback() {
        fallback.hidden = true;
        if (returnFocus?.isConnected) {
            returnFocus.focus();
        } else {
            document.querySelector('.hero-socials a[href^="mailto:"]')?.focus();
        }
    }

    document.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const mailLink = event.target.closest('a[href^="mailto:"]');
        if (!mailLink) return;
        const dialog = document.getElementById("project-dialog");
        if (dialog.open) {
            returnFocus = projectDialogTrigger;
        } else if (mailLink.closest("#mobile-nav")) {
            returnFocus = document.getElementById("menu-toggle");
        } else {
            returnFocus = mailLink;
        }
        if (dialog.open) {
            restoreFocusAfterDialogClose = false;
            dialog.close();
        }
        fallback.hidden = false;
        message.textContent = textFor("mailFallbackMessage");
        status.hidden = true;
        copyStatusKey = "";
        copyButton.focus();
    });
    document.getElementById("mail-fallback-close").addEventListener("click", closeFallback);
    copyButton.addEventListener("click", async () => {
        let copied = false;
        const email = siteData?.contactEmail || "diegodvsmelo@gmail.com";
        try {
            await navigator.clipboard.writeText(email);
            copied = true;
        } catch {
            try {
                copied = copyEmailWithFallback(email);
            } catch {
                copied = false;
            }
        }
        copyStatusKey = copied ? "emailCopied" : "emailCopyFailed";
        status.textContent = textFor(copyStatusKey);
        status.hidden = false;
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !fallback.hidden) closeFallback();
    });
}

if (siteData) {
    setupProjectDialog();
}
setupMobileMenu();
setupClickJuice();
setupLanguageSwitcher();
setupMailFallback();
setLanguage(preferredLanguage());
document.getElementById("year").textContent = new Date().getFullYear();
