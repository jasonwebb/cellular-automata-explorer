import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';

export function createStatesGroup() {
  let group = createGroup('States');

  // Number of states
  group.appendChild(
    createSlider('Number of states', 2, 500, 1, () => {
      console.log('state number changed');
    })
  );

  // Cyclic (checkbox)
  group.appendChild(
    createCheckbox('Cyclic', false, () => {
      console.log('cyclic changed');
    })
  );

  return group;
}