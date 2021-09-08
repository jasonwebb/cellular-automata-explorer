import { createGroup, createDropdown, createSlider, createCheckbox } from './components';
import { simulationUniforms } from '../uniforms';
import { NeighborhoodTypes } from '../rules';
import variables from '../variables';

export function createNeighborhoodGroup() {
  let group = createGroup('Neighborhood');

  window.addEventListener('rebuildUI', () => {
    // Get rid of any previously-added components
    group.querySelectorAll('.component').forEach((component) => {
      component.remove();
    });

    // Type (Moore or von Neumann)
    group.appendChild(
      createDropdown('Type', Object.keys(NeighborhoodTypes), NeighborhoodTypes[variables.activeRule.neighborhoodType], (e) => {
        variables.activeRule.neighborhoodType = NeighborhoodTypes[e.target.value];
        simulationUniforms.neighborhoodType.value = variables.activeRule.neighborhoodType;
        window.dispatchEvent(new Event('rebuildUI'));
      })
    );

    // Range (number)
    group.appendChild(
      createSlider('Range', 1, 10, 1, variables.activeRule.range, (e) => {
        variables.activeRule.range = e.target.value;
        simulationUniforms.range.value = variables.activeRule.range;
        window.dispatchEvent(new Event('rebuildUI'));
      })
    );

    // Include center (checkbox)
    group.appendChild(
      createCheckbox('Include center', variables.activeRule.includeCenter, (e) => {
        variables.activeRule.includeCenter = e.target.checked;
        simulationUniforms.includeCenter.value = variables.activeRule.includeCenter;
        window.dispatchEvent(new Event('rebuildUI'));
      })
    );
  });

  return group;
}