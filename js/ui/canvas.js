import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';
import variables from '../variables'

export function createCanvasGroup() {
  let group = createGroup('Canvas');

  // Width slider
  group.appendChild(
    createSlider('Width', 1, variables.canvas.width.max, 1, variables.canvas.width.value, () => {
      console.log('canvas width changed');
    })
  );

  // Height slider
  group.appendChild(
    createSlider('Height', 1, variables.canvas.height.max, 1, variables.canvas.height.value, () => {
      console.log('canvas height changed');
    })
  );

  // Maximized checkbox
  group.appendChild(
    createCheckbox('Maximized', variables.canvas.maximized, () => {
      console.log('maximized changed');
    })
  );

  return group;
}