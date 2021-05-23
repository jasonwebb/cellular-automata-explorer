import { createGroup, createDropdown, createSlider, createCheckbox } from './components';

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

  // Include center (checkbox)
  group.appendChild(
    createCheckbox('Include center', true, () => {
      console.log('include center changed');
    })
  );

  return group;
}