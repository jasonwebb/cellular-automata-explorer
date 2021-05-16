import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';

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
    createSlider('Range', 1, 10, 1, () => {
      console.log('range changed');
    })
  );

  // Edge wrapping (checkbox)
  group.appendChild(
    createCheckbox('Wrap edges', false, () => {
      console.log('wrap edge changed');
    })
  );

  return group;
}