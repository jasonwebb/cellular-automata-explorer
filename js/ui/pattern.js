import { createGroup, createDropdown } from './components';
import variables from '../variables';
import { InitialPatternTypes } from '../patterns';

export function createPatternGroup() {
  let group = createGroup('Starting pattern');

  // Dropdown for patterns
  group.appendChild(
    createDropdown('Starting pattern', InitialPatternTypes, (e) => {
      variables.activePattern = e.target.value;
    })
  );

  return group
}