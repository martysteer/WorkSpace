/*-----------------------------------------------------------------------------------*/
/*  01. INIT
/*-----------------------------------------------------------------------------------*/

const initHolograms = () => {
    Scene = new HoloScene('hologram');
    console.log('initApp');

}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    initHolograms()
} else {
    document.addEventListener('DOMContentLoaded', initHolograms)
}
