import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';
import variables from '../variables';

export function createNeighborhoodGroup() {
  let group = createGroup('Neighborhood');

  // Type (Moore or von Neumann)
  group.appendChild(
    createDropdown('Type', ['von Neumann', 'Moore'], () => {
      console.log('changed neighborhood type');
    })
  );

  // Range (number)
  group.appendChild(
    createSlider('Range', 1, 10, 1, 1, () => {
      console.log('range changed');
    })
  );

  // Edge wrapping (X) checkbox
  group.appendChild(
    createCheckbox('Wrap X', variables.wrap.x, () => {
      console.log('wrap x changed');
      variables.wrap.x = !variables.wrap.x;
    })
  );

  // Edge wrapping (Y) checkbox
  group.appendChild(
    createCheckbox('Wrap Y', variables.wrap.y, () => {
      console.log('wrap y changed');
      variables.wrap.y = !variables.wrap.y;
    })
  );

  return group;
}