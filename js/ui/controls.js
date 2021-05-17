import { createGroup, createDropdown, createButton, createSlider, createCheckbox } from './components';

export function createControlsGroup() {
  let group = createGroup('Controls');

  // Play/pause button
  group.appendChild(
    createButton('Pause', () => {
      console.log('pressed');
    })
  );

  // Speed slider
  group.appendChild(
    createSlider('Speed', 0.1, 2.0, .1, 1.0, () => {
      console.log('speed changed');
    })
  );

  // Restart button
  group.appendChild(
    createButton('Restart', () => {
      console.log('restart');
    })
  );

  return group;
}