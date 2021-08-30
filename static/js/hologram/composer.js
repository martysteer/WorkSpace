import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from './three/examples/jsm/postprocessing/ShaderPass.js';

// https://github.com/felixturner/bad-tv-shader modified to js module and export shader
import { BadTVShader } from './shaders/bad-tv-shader-master/BadTVShader.js';


function createMainComposer(container, camera, scene, renderer) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Bloom pass
  const bloomPass = new UnrealBloomPass(container.clientHeight / container.clientHeight, 0.5, .8, .3);
  composer.addPass(bloomPass);

  // Bad TV Pass
  var badTVPass = new ShaderPass(BadTVShader);
  badTVPass.uniforms.distortion.value = 1.9;
  badTVPass.uniforms.distortion2.value = 1.2;
  badTVPass.uniforms.speed.value = 0.1;
  badTVPass.uniforms.rollSpeed.value = 0;

  composer.addPass(badTVPass);
  // composer.addPass(filmPass);
  // composer.addPass(blendPass);

  return composer;
}


function createOcclusionComposer() {

}


export { createMainComposer, createOcclusionComposer };

