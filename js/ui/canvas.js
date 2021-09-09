import * as THREE from 'three';

import { createGroup, createSlider, createCheckbox, createSeperator } from './components';
import { resetTextureSizes } from '../entry';
import { simulationUniforms } from '../uniforms';
import variables from '../variables';

export function createCanvasGroup() {
  let group = createGroup('Canvas');

  window.addEventListener('rebuildUI', () => {
    // Get rid of any previously-added components
    group.querySelectorAll('.component, hr').forEach((component) => {
      component.remove();
    });

    // Width slider
    let widthSlider = createSlider('Width', variables.canvas.width.min, variables.canvas.width.max, variables.canvas.width.stepSize, variables.canvas.width.value, (e) => {
        variables.canvas.width.value = e.target.value;
        resetTextureSizes();
      });

    if(variables.canvas.maximized) {
      widthSlider.querySelectorAll('input').forEach((element) => {
        element.setAttribute('disabled','');
      });
    } else {
      widthSlider.querySelectorAll('input').forEach((element) => {
        element.removeAttribute('disabled');
      });
    }

    group.appendChild(widthSlider);

    // Height slider
    let heightSlider = createSlider('Height', variables.canvas.height.min, variables.canvas.height.max, variables.canvas.height.stepSize, variables.canvas.height.value, (e) => {
        variables.canvas.height.value = e.target.value;
        resetTextureSizes();
      });

    if(variables.canvas.maximized) {
      heightSlider.querySelectorAll('input').forEach((element) => {
        element.setAttribute('disabled','');
      });
    } else {
      heightSlider.querySelectorAll('input').forEach((element) => {
        element.removeAttribute('disabled');
      });
    }

    group.appendChild(heightSlider);

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
        window.dispatchEvent(new Event('rebuildUI'));
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
      createSlider('Scale', variables.canvas.scale.min, variables.canvas.scale.max, variables.canvas.scale.stepSize, variables.canvas.scale.value, (e) => {
        variables.canvas.scale.value = 1/e.target.value;

        simulationUniforms.resolution.value = new THREE.Vector2(
          variables.canvas.width.value * variables.canvas.scale.value,
          variables.canvas.height.value * variables.canvas.scale.value
        );

        resetTextureSizes();
      })
    );
  });

  return group;
}