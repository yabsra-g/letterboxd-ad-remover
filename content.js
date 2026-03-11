function textOf(el) {
    return ((el.innerText || "") + " " + (el.textContent || "")).toLowerCase();
}

function htmlOf(el) {
    return (el.innerHTML || "").toLowerCase();
}

function isAdmiralRelated(el) {
    if (!(el instanceof HTMLElement)) return false;

    const text = textOf(el);
    const html = htmlOf(el);

    return (
        text.includes("continue without supporting us") ||
        text.includes("here’s looking at you, kid") ||
        text.includes("here's looking at you, kid") ||
        text.includes("playwire vrm") ||
        text.includes("contact support") ||
        html.includes("getadmiral.com") ||
        html.includes("images.getadmiral.com") ||
        html.includes("getadmiral.typeform.com")
    );
}

function removeLargeFixedOverlays() {
    const all = document.querySelectorAll("div, section, aside");

    all.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        const looksLikeOverlay =
            (style.position === "fixed" || style.position === "sticky") &&
            rect.width >= window.innerWidth * 0.9 &&
            rect.height >= window.innerHeight * 0.9 &&
            parseFloat(style.opacity || "1") > 0 &&
            style.display !== "none" &&
            style.visibility !== "hidden";

        const darkBackground =
            style.backgroundColor.includes("rgba") ||
            style.backgroundColor.includes("rgb");

        if (looksLikeOverlay && darkBackground) {
            el.remove();
        }
    });
}

function removeAdmiralPopup() {
    document.querySelectorAll("div, section, aside").forEach((el) => {
        if (isAdmiralRelated(el)) {
            let root = el;

            for (let i = 0; i < 8; i++) {
                if (!root.parentElement) break;
                if (root.parentElement === document.body) break;
                root = root.parentElement;
            }

            root.remove();
        }
    });

    document.querySelectorAll("iframe").forEach((iframe) => {
        const src = iframe.src || "";
        if (src.includes("getadmiral") || src.includes("admiral")) {
            iframe.remove();
        }
    });

    removeLargeFixedOverlays();

    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.documentElement.style.position = "";
    document.body.style.position = "";
    document.documentElement.style.pointerEvents = "auto";
    document.body.style.pointerEvents = "auto";

    [
        "modal-open",
        "popup-open",
        "no-scroll",
        "overflow-hidden",
        "fancybox-enabled",
        "is-modal-open"
    ].forEach((cls) => {
        document.documentElement.classList.remove(cls);
        document.body.classList.remove(cls);
    });
}

function removeProBanner() {
    document
        .querySelectorAll(".banner.banner-950.js-hide-in-app, .banner-950")
        .forEach((el) => el.remove());

    document.querySelectorAll('a[href*="/pro/?utm_medium=banner"]').forEach((a) => {
        const banner = a.closest(".banner");
        if (banner) banner.remove();
    });
}

function cleanPage() {
    removeAdmiralPopup();
    removeProBanner();
}

cleanPage();

const observer = new MutationObserver(() => {
    cleanPage();
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

setInterval(cleanPage, 1000);