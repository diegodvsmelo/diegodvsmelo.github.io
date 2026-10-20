(() => {
    "use strict";
    const language = portfolioGame.language();
    const text = {
        pt: {
            back: "Voltar aos projetos", loading: "Carregando o jogo…", initializing: "Inicializando o jogo…",
            error: "Não foi possível carregar o jogo. Tente novamente.", retry: "Tentar novamente",
            fullscreen: "Tela cheia", exitFullscreen: "Sair da tela cheia", noFullscreen: "Tela cheia indisponível neste navegador.",
            fullscreenError: "Não foi possível alterar a tela cheia.",
            exitTitle: "Sair do DinoForce?", exitDescription: "Sair encerra esta sessão e pode perder o progresso. A retomada da partida não é garantida.",
            continue: "Continuar jogando", exit: "Sair do jogo", status: "Status", version: "Versão",
            controls: "Controles", description: "Descrição", technologies: "Tecnologias", credits: "Créditos",
            missing: "Não informado nos materiais disponíveis."
        },
        en: {
            back: "Back to projects", loading: "Loading the game…", initializing: "Initializing the game…",
            error: "The game could not load. Please try again.", retry: "Try again",
            fullscreen: "Fullscreen", exitFullscreen: "Exit fullscreen", noFullscreen: "Fullscreen is unavailable in this browser.",
            fullscreenError: "Could not change fullscreen mode.",
            exitTitle: "Leave DinoForce?", exitDescription: "Leaving ends this session and may lose progress. Resuming the match is not guaranteed.",
            continue: "Keep playing", exit: "Leave game", status: "Status", version: "Version",
            controls: "Controls", description: "Description", technologies: "Technologies", credits: "Credits",
            missing: "Not specified in the available materials."
        }
    }[language];
    document.documentElement.lang = language === "en" ? "en" : "pt-BR";
    document.querySelectorAll("[data-game-text]").forEach(element => { element.textContent = text[element.dataset.gameText]; });
    const $ = id => document.getElementById(id);
    const host = $("frame-host"), loading = $("loading"), status = $("status"), progress = $("progress");
    const fullscreen = $("fullscreen"), note = $("fullscreen-note"), dialog = $("exit-dialog");
    const project = siteData[language].projects.find(item => item.visual === "dinoforce");
    const details = $("game-details");
    const heading = document.createElement("h1");
    heading.textContent = project.title;
    details.append(heading);
    for (const [label, value] of [
        [text.status, project.status || text.missing], [text.version, dinoForceBuild.config.productVersion],
        [text.controls, project.controls], [text.description, project.description],
        [text.technologies, project.stack.join(" · ")], [text.credits, project.credits || text.missing]
    ]) {
        const h = document.createElement("h2"), p = document.createElement("p");
        h.textContent = label; p.textContent = value; details.append(h, p);
    }
    const backUrl = new URL("../../", location.href);
    backUrl.searchParams.set("lang", language);
    backUrl.searchParams.set("project", "dinoforce");
    const query = new URLSearchParams(location.search);
    for (const key of ["returnY", "panelY"]) {
        const value = Number(query.get(key));
        if (query.has(key) && Number.isFinite(value) && value >= 0) backUrl.searchParams.set(key, String(value));
    }
    backUrl.hash = "projetos";
    $("back").href = backUrl.href;
    let frame = null, ready = false, busy = false, departing = false, watchdog;
    const listeners = new AbortController();
    const on = (target, event, handler) => target.addEventListener(event, handler, { signal: listeners.signal });
    const beforeUnload = event => {
        if (!ready || departing) return;
        event.preventDefault(); event.returnValue = "";
    };
    on(window, "beforeunload", beforeUnload);

    async function dispose() {
        ready = false;
        clearTimeout(watchdog);
        fullscreen.disabled = true;
        const previous = frame;
        frame = null; // Ignore late messages from a discarded attempt.
        if (!previous) return;
        try {
            // Timeout also covers a loader that never resolved; removing the frame
            // destroys its JS realm, including the build's anonymous listeners.
            await Promise.race([
                previous.contentWindow?.dinoForcePlayer?.quit(),
                new Promise(resolve => setTimeout(resolve, 2500))
            ]);
        } catch (error) { console.warn("DinoForce disposal", error); }
        previous.remove();
    }
    async function fail(error) {
        if (busy || departing) return;
        busy = true;
        console.error("DinoForce player failed", error);
        loading.hidden = false; status.textContent = text.error;
        progress.hidden = true; $("percent").hidden = true;
        await dispose();
        $("retry").hidden = false; busy = false;
    }
    async function start() {
        if (busy || departing || portfolioGame.isMobileDevice()) return;
        busy = true;
        $("retry").hidden = true;
        await dispose();
        loading.hidden = false; status.textContent = text.loading;
        progress.hidden = false; progress.removeAttribute("value");
        $("percent").hidden = false; $("percent").textContent = "";
        frame = document.createElement("iframe");
        frame.title = "DinoForce";
        frame.allow = "autoplay; fullscreen";
        frame.src = `player.html?v=20261020-1&lang=${language}`;
        host.append(frame);
        busy = false;
        watchdog = setTimeout(() => fail(new Error("Player initialization timeout")), 180000);
    }
    on(window, "message", event => {
        if (event.origin !== location.origin || event.source !== frame?.contentWindow || event.data?.channel !== "dinoforce") return;
        const { type, value } = event.data;
        if (type === "progress" && Number.isFinite(value)) {
            progress.value = Math.max(0, Math.min(1, value));
            $("percent").textContent = `${Math.round(progress.value * 100)}%`;
            if (value >= 1) status.textContent = text.initializing;
        } else if (type === "ready") {
            clearTimeout(watchdog); ready = true; loading.hidden = true;
            fullscreen.disabled = !document.fullscreenEnabled || !$("game-player").requestFullscreen;
            if (fullscreen.disabled) note.textContent = text.noFullscreen;
        } else if (type === "error") void fail(value);
    });
    on($("retry"), "click", start);
    on(fullscreen, "click", async () => {
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await $("game-player").requestFullscreen();
            note.textContent = "";
        } catch (error) { console.warn("DinoForce fullscreen", error); note.textContent = text.fullscreenError; }
    });
    on(document, "fullscreenchange", () => { fullscreen.textContent = document.fullscreenElement ? text.exitFullscreen : text.fullscreen; });
    async function leave() {
        if (departing) return;
        departing = true;
        dialog.close();
        await dispose();
        listeners.abort();
        location.assign(backUrl);
    }
    on($("back"), "click", event => {
        event.preventDefault();
        if (ready) { dialog.showModal(); $("continue").focus(); }
        else void leave();
    });
    on($("continue"), "click", () => dialog.close());
    on($("exit"), "click", leave);
    on(window, "pagehide", () => { departing = true; void dispose(); listeners.abort(); });
    // A restored bfcache document must not retain a discarded player.
    window.addEventListener("pageshow", event => { if (event.persisted) location.reload(); });
    if (portfolioGame.isMobileDevice()) {
        status.textContent = portfolioGame.desktopOnly[language];
        progress.hidden = true;
    } else void start();
})();
