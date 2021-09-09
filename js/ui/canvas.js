import * as THREE from 'three';

import { createGroup, createSlider, createCheckbox, createSeperator } from './components';
import { resetTextureSizes } from '../entry';
import { simulationUniforms } from '../uniforms';
import variables from '../variables';

export function createCanvasGroup() {
  let group = createGroup('Canvas');

  // Width slider
  group.appendChild(
    createSlider('Width', 1, variables.canvas.width.max, 1, variables.canvas.width.value, (e) => {
      variables.canvas.width.value = e.target.value;
      resetTextureSizes();
    })
  );

  // Height slider
  group.appendChild(
    createSlider('Height', 1, variables.canvas.height.max, 1, variables.canvas.height.value, (e) => {
      variables.canvas.height.value = e.target.value;
      resetTextureSizes();
    })
  );

  // Maximized checkbox
  group.appendChild(
    createCheckbox('Maximized', variables.canvas.maximized, (e) => {
      variables.canvas.maximized = e.target.checked;

      if(variables.canvas.maximized) {
        variables.canvas.unmaximizedSize.width = variables.canvas.width.value;
        variables.canvas.unmaximizedSize.height = variables.canvas.height.value;
      } else {
        variables.canvas.width.value = variables.canvas.unmaximizedSize.width;
        variables.canvas.height.value = variables.canvas.unmaximizedSize.height;
      }

      resetTextureSizes();
    })
  );

    group.appendChild( createSeperator() );

  // Edge wrapping (X) checkbox
  group.appendChild(
    createCheckbox('Wrap X', variables.canvas.wrap.x, () => {
      variables.canvas.wrap.x = !variables.canvas.wrap.x;
      simulationUniforms.wrapping.value.x = variables.canvas.wrap.x;
    })
  );

  // Edge wrapping (Y) checkbox
  group.appendChild(
    createCheckbox('Wrap Y', variables.canvas.wrap.y, () => {
      variables.canvas.wrap.y = !variables.canvas.wrap.y;
      simulationUniforms.wrapping.value.y = variables.canvas.wrap.y;
    })
  );

    group.appendChild( createSeperator() );

  // Scale slider
  group.appendChild(
    createSlider('Scale', .1, 5, .01, variables.canvas.scale.value, (e) => {
      variables.canvas.scale.value = 1/e.target.value;

      simulationUniforms.resolution.value = new THREE.Vector2(
        variables.canvas.width.value * variables.canvas.scale.value,
        variables.canvas.height.value * variables.canvas.scale.value
      );

      resetTextureSizes();
    })
  );

  return group;
}