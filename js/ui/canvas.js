import { createGroup, createSlider, createCheckbox, createSeperator } from './components';
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
    createSlider('Scale', .1, 3, .1, variables.canvas.scale.value, (e) => {
      variables.canvas.scale.value = 3 - e.target.value;
    })
  );

  return group;
}