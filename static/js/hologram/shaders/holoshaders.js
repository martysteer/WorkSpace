/**
 * Hologram shaders for Holographic Projection
 * A Pen created on CodePen.io.
 * Original URL: https://codepen.io/peterhry/pen/egzjGR
 * 
 * VolumetericLightShader
 * PassThroughShader
 * AdditiveBlendingShader
 * 
 **/
import { Vector2 } from '../three/build/three.module.js';


const VolumetericLightShader = {
  uniforms: {
    tDiffuse: {
      value: null
    },
    lightPosition: {
      value: new Vector2(0.5, 0.5)
    },
    exposure: {
      value: 1
    },
    decay: {
      value: 1
    },
    density: {
      value: 6
    },
    weight: {
      value: 0.57
    },
    samples: {
      value: 30
    }
  },


  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"
  ].
  join("\n"),

  fragmentShader: [
    "varying vec2 vUv;",
    "uniform sampler2D tDiffuse;",
    "uniform vec2 lightPosition;",
    "uniform float exposure;",
    "uniform float decay;",
    "uniform float density;",
    "uniform float weight;",
    "uniform int samples;",
    "const int MAX_SAMPLES = 100;",
    "void main()",
    "{",
    "vec2 texCoord = vUv;",
    "vec2 deltaTextCoord = texCoord - lightPosition;",
    "deltaTextCoord *= 1.0 / float(samples) * density;",
    "vec4 color = texture2D(tDiffuse, texCoord);",
    "float illuminationDecay = 1.0;",
    "for(int i=0; i < MAX_SAMPLES; i++)",
    "{",
    "if(i == samples) {",
    "break;",
    "}",
    "texCoord += deltaTextCoord;",
    "vec4 sample = texture2D(tDiffuse, texCoord);",
    "sample *= illuminationDecay * weight;",
    "color += sample;",
    "illuminationDecay *= decay;",
    "}",
    "gl_FragColor = color * exposure;",
    "}"
  ].
  join("\n")
};


// ----------------------------------------------------------
const AdditiveBlendingShader = {
  uniforms: {
    tDiffuse: {
      value: null
    },
    tAdd: {
      value: null
    }
  },


  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"
  ].
  join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform sampler2D tAdd;",
    "varying vec2 vUv;",
    "void main() {",
    "vec4 color = texture2D(tDiffuse, vUv);",
    "vec4 add = texture2D(tAdd, vUv);",
    "gl_FragColor = color + add;",
    "}"
  ].
  join("\n")
};



// ----------------------------------------------------------
const PassThroughShader = {
  uniforms: {
    tDiffuse: {
      value: null
    }
  },


  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"
  ].
  join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
    "gl_FragColor = texture2D(tDiffuse, vec2(vUv.x, vUv.y));",
    "}"
  ].
  join("\n")
};


// ----------------------------------------------------------
export { VolumetericLightShader, AdditiveBlendingShader, PassThroughShader };