import { createGroup, createDropdown, createTextInput, createButton, createSeperator } from './components';
import presets from '../presets';
import variables from '../variables';
import { setRule } from '../rules';

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
    createDropdown('Preset', rulesSimplified, null, (e) => {
      for(let family in presets) {
        if(presets[family].hasOwnProperty(e.target.value)) {
          setRule(presets[family][e.target.value]);
        }
      }
    })
  );

    group.appendChild(createSeperator());

  // Text input for the rule string
  group.appendChild(
    createTextInput('Rule', '', (e) => {
      console.log('rule text changed');
    })
  );

    // Set the rule when the user presses 'Enter' while on the text input
    group.querySelector('.text-input input').addEventListener('keydown', (e) => {
      if(e.key === 'Enter') {
        setRule(group.querySelector('.text-input input').value);
      }
    })

    // Show the current rule string in this text input anytime it changes
    window.addEventListener('ruleUpdated', () => {
      group.querySelector('.text-input input').value = variables.activeRule.ruleString;
    });

  // Button to manually set a custom rule typed into the text input
  group.appendChild(
    createButton('Set rule', true, () => {
      setRule(group.querySelector('.text-input input').value);
    })
  );

  return group;
}