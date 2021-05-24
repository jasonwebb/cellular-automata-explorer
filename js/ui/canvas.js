import { createGroup, createSlider, createCheckbox } from './components';
import variables from '../variables'
import { resetTextureSizes } from '../entry';
import { simulationUniforms } from '../uniforms';

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
      variables.canvas.maximized = e.target.value;
      resetTextureSizes();
    })
  );

  // Edge wrapping (X) checkbox
  group.appendChild(
    createCheckbox('Wrap X', variables.wrap.x, () => {
      variables.wrap.x = !variables.wrap.x;
      simulationUniforms.wrapping.value.x = variables.wrap.x;
    })
  );

  // Edge wrapping (Y) checkbox
  group.appendChild(
    createCheckbox('Wrap Y', variables.wrap.y, () => {
      variables.wrap.y = !variables.wrap.y;
      simulationUniforms.wrapping.value.y = variables.wrap.y;
    })
  );

  // Scale slider
  group.appendChild(
    createSlider('Scale', .1, 3, .1, variables.scale.value, (e) => {
      variables.scale.value = 3 - e.target.value;
    })
  );

  return group;
}