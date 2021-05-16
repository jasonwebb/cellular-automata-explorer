import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';

export function createRulesGroup() {
  let group = createGroup('Rules');

  // Dropdown for presets
  group.appendChild(
    createDropdown('Preset', ['hello'], () => {
      console.log('changed');
    })
  );

  // If custom, show text input

  return group;
}