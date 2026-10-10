export const WA_NUMBER = "595971758226";

export const waLink = (text) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const WA_DEFAULT_LINK = waLink("Hola vi WebCreatorPY quiero mi web");

export const EMAIL = "webcreatorpy99@gmail.com";

export const INSTAGRAM_URL =
    "https://www.instagram.com/webcreatorpy?rpxt=MWxmbm15Ym9kMGJ2cw%3D%3D&utm_source=qr";
export const FACEBOOK_URL =
    "https://www.facebook.com/share/1AETFSbzHo/?mibextid=wwXIfr";

export const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -80, duration: 1.3 });
    } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
};
