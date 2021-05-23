import * as THREE from 'three';

import { displayUniforms } from "./uniforms";

export let colors = [
  [0, .3, .2, 1],  // state 0 color
  [1, .8, .4, 1]   // state 1 color
]

export function setColors() {
  let data = new Float32Array(colors.length * 4);  // RGBA = 4 channels

  colors.forEach((color, offset) => {
    for(let i=0; i<=color.length; i++) {
      data[i + offset * color.length] = color[i];
    }
  });

  displayUniforms.colors.value = new THREE.DataTexture(data, colors.length, 1, THREE.RGBAFormat, THREE.FloatType);
}