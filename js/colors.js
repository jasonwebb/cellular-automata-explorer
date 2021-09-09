import * as THREE from 'three';

import { displayUniforms } from "./uniforms";

export let colors = [
  [26,50,122],     // state 0 color
  [255,255,255]  // state 1 color
]

export function setColors() {
  let data = new Float32Array(colors.length * 4);  // RGBA = 4 channels

  colors.forEach((color, offset) => {
    let normalizedColor = normalizeRGB(color);

    for(let i=0; i<=color.length; i++) {
      data[i + (offset * 4)] = normalizedColor[i];
    }

    data[3 + (offset * 4)] = 0; // A channel, currently used for nothing
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
    let rgb = hex.substring(1, hex.length).match(/.{1,2}/g); // split hex string into an array of strings, 2 characters in length.

    return [
      parseInt(rgb[0], 16),
      parseInt(rgb[1], 16),
      parseInt(rgb[2], 16)
    ];
  }

  export function normalizeRGB(color) {
    return [
      color[0] / 255,
      color[1] / 255,
      color[2] / 255
    ];
  }