import * as THREE from 'three';

import { displayUniforms } from "./uniforms";

export function setColors() {
  const numColors = 2;
  let data = new Float32Array(numColors * 4);  // RGBA = 4 channels

  // State 0 color
  data[0] = 0;
  data[1] = .3;
  data[2] = .2;
  data[3] = 1;

  // Sate 1 color
  data[4] = 1;
  data[5] = .8;
  data[6] = .4;
  data[7] = 1;

  displayUniforms.colors.value = new THREE.DataTexture(data, numColors, 1, THREE.RGBAFormat, THREE.FloatType);
}