(() => {
    "use strict";
    if (window.parent === window || portfolioGame.isMobileDevice()) return;
    const language = portfolioGame.language();
    const en = language === "en";
    document.documentElement.lang = en ? "en" : "pt-BR";
    const $ = id => document.getElementById(id);
    const canvas = $("unity-canvas");
    $("pause-text").textContent = en ? "Game paused" : "Jogo pausado";
    $("resume-game").textContent = en ? "Resume game" : "Retomar jogo";
    $("start-game").textContent = en ? "Start game" : "Iniciar jogo";
    $("audio-text").textContent = en ? "Interact with the game to allow browser audio." : "Interaja com o jogo para permitir o áudio no navegador.";
    $("storage-warning").textContent = en ? "Storage unavailable: progress is limited to this session." : "Armazenamento indisponível: progresso apenas nesta sessão.";
    let instance = null, cancelled = false, initialization = null;
    const send = (type, value) => parent.postMessage({ channel: "dinoforce", type, value }, location.origin);
    const fail = error => { console.error("DinoForce Unity", error); send("error", String(error)); };
    const root = new URL(dinoForceBuild.root, location.href);
    const config = { ...dinoForceBuild.config };
    for (const key of ["dataUrl", "frameworkUrl", "codeUrl", "streamingAssetsUrl"]) config[key] = new URL(config[key], root).href;
    config.devicePixelRatio = Math.min(devicePixelRatio || 1, 1.5);
    config.showBanner = (message, type) => type === "error" ? fail(message) : console.warn(message);
    // No game-start event is exported: resolved initialization is the conservative
    // boundary used by the parent for exit confirmation.
    window.dinoForcePlayer = {
        async quit() {
            cancelled = true;
            if (!instance && initialization) {
                try { await initialization; } catch { /* Already failed. */ }
            }
            if (instance) { const old = instance; instance = null; await old.Quit(); }
        }
    };
    canvas.addEventListener("contextmenu", event => event.preventDefault());
    canvas.addEventListener("wheel", event => { if (!event.ctrlKey && !event.metaKey) event.preventDefault(); }, { passive: false });
    canvas.addEventListener("pointerdown", () => canvas.focus());
    canvas.addEventListener("keydown", event => {
        if (!event.ctrlKey && !event.metaKey && ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
    });
    // The existing compiled bridge owns blur/visibility, Time.timeScale,
    // AudioListener.pause, resume-game and its user-gesture audio unlock.
    // Keep these IDs intact; do not duplicate its SendMessage calls.
    $("start-game").addEventListener("click", () => {
        // Reuse the real bridge's existing resume/unlock handler on a user gesture.
        $("resume-game").click();
        $("audio-overlay").hidden = true;
    });
    const script = document.createElement("script");
    script.src = new URL(dinoForceBuild.loader, root).href;
    script.onerror = () => fail(new Error("Unity loader download failed"));
    script.onload = () => {
        if (cancelled) return;
        try {
            initialization = Promise.resolve(createUnityInstance(canvas, config, value => {
                if (!cancelled) send("progress", value);
            }));
        } catch (error) { fail(error); return; }
        initialization.then(async value => {
            instance = value;
            if (cancelled) return;
            send("ready");
            // No public audio-state API is exported. Request a gesture via the
            // verified bridge and make no claim that audio is running/audible.
            $("audio-overlay").hidden = false;
        }).catch(fail);
    };
    document.body.append(script);
})();
