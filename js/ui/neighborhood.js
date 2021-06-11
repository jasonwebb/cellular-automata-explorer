import { createGroup, createDropdown, createSlider, createCheckbox } from './components';
import { simulationUniforms } from '../uniforms';
import variables from '../variables';
import { NeighborhoodTypes } from '../rules';

export function createNeighborhoodGroup() {
  let group = createGroup('Neighborhood');

  // Type (Moore or von Neumann)
  group.appendChild(
    createDropdown('Type', Object.keys(NeighborhoodTypes), (e) => {
      variables.activeRule.neighborhoodType = NeighborhoodTypes[e.target.value];
      simulationUniforms.neighborhoodType.value = variables.activeRule.neighborhoodType;
    })
  );

  // Range (number)
  group.appendChild(
    createSlider('Range', 1, 10, 1, 1, (e) => {
      variables.activeRule.range = e.target.value;
      simulationUniforms.range.value = variables.activeRule.range;
    })
  );

  // Include center (checkbox)
  group.appendChild(
    createCheckbox('Include center', true, (e) => {
      variables.activeRule.includeCenter = e.target.value;
      simulationUniforms.includeCenter.value = variables.activeRule.includeCenter;
    })
  );

  return group;
}