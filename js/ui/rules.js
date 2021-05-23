import { createGroup, createDropdown } from './components';
import presets from '../presets';

export function createRulesGroup() {
  let group = createGroup('Rules');

  // Reduce the rule presets to a multi-dimensional array of strings for the dropdown
  let rulesSimplified = [];
  Object.keys(presets).forEach((family) => {
    rulesSimplified[family] = [];

    Object.keys(presets[family]).forEach((rule) => {
      rulesSimplified[family].push(rule);
    });
  });

  // Dropdown for presets
  group.appendChild(
    createDropdown('Preset', rulesSimplified, (e) => {
      console.log('changed');
    })
  );

  // If custom, show text input

  return group;
}