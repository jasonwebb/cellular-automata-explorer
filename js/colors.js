import * as THREE from 'three';

import { displayUniforms } from "./uniforms";

export let colors = [
  [0, 78, 51],     // state 0 color
  [255, 220, 170]  // state 1 color
]

export function setColors() {
  let data = new Float32Array(colors.length * 4);  // RGBA = 4 channels

  colors.forEach((color, offset) => {
    let normalizedColor = normalizeRGB(color);

    for(let i=0; i<=color.length; i++) {
      data[i + offset * color.length] = normalizedColor[i];
    }
  });

  displayUniforms.colors.value = new THREE.DataTexture(data, colors.length, 1, THREE.RGBAFormat, THREE.FloatType);
}

  export function convertRGBtoHex(rgb) {
    let rgbClone = [...rgb];

    rgbClone[0] = rgbClone[0].toString(16);
    rgbClone[1] = rgbClone[1].toString(16);
    rgbClone[2] = rgbClone[2].toString(16);

    if (rgbClone[0].length == 1)
      rgbClone[0] = "0" + rgbClone[0];
    if (rgbClone[1].length == 1)
      rgbClone[1] = "0" + rgbClone[1];
    if (rgbClone[2].length == 1)
      rgbClone[0] = "0" + rgbClone[2];

    return "#" + rgbClone[0] + rgbClone[1] + rgbClone[2];
  }

  export function convertHexToRGB(hex) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (hex.length == 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];

    // 6 digits
    } else if (hex.length == 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }

    return [r, g, b];
  }

  export function normalizeRGB(color) {
    return [
      color[0] / 255,
      color[1] / 255,
      color[2] / 255
    ];
  }