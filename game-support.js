// Shared navigation/device policy. This file never requests Unity assets.
window.portfolioGame = {
    desktopOnly: {
        pt: "Disponível apenas em computadores.",
        en: "Available on desktop computers only."
    },
    isMobileDevice() {
        const ua = navigator.userAgent;
        return navigator.userAgentData?.mobile === true ||
            /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle/i.test(ua) ||
            (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    },
    language() {
        const query = new URLSearchParams(location.search).get("lang");
        if (["pt", "en"].includes(query)) return query;
        try {
            const saved = localStorage.getItem("portfolio-language");
            if (["pt", "en"].includes(saved)) return saved;
        } catch { /* Language works without storage. */ }
        return navigator.language?.startsWith("en") ? "en" : "pt";
    }
};
