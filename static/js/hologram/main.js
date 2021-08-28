import { Hologram } from './Hologram.js'

// Main function to initialise the Hologram object
function main() {
    const container = document.querySelector('#hologram');
    const holo = new Hologram(container);
    holo.render();
}

// Call main and start the hologram
main();