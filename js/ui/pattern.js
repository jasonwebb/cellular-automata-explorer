import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';

export function createPatternGroup() {
  let group = createGroup('Starting pattern');

  // Dropdown for patterns
  group.appendChild(
    createDropdown('Starting pattern', ['test'], () => {
      console.log('starting pattern changed');
    })
  );

  return group
}