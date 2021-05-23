import { createGroup, createDropdown } from './components';
import variables from '../variables';

export function createPatternGroup() {
  let group = createGroup('Starting pattern');

  // Create an array of strings from the pattern keys
  let patternsSimpleList = [];
  Object.keys(variables.patterns).forEach((pattern) => {
    patternsSimpleList.push(pattern.charAt(0).toUpperCase() + pattern.slice(1, pattern.length));
  });

  // Dropdown for patterns
  group.appendChild(
    createDropdown('Starting pattern', patternsSimpleList, (e) => {
      console.log('starting pattern changed to: ' + e.target.value);
    })
  );

  return group
}