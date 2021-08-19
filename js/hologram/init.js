// Init the hologram scene.
const initHolograms = () => {
    Scene = new HoloScene('hologram');
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    initHolograms()
} else {
    document.addEventListener('DOMContentLoaded', initHolograms)
}
