import { createGroup, createColorPicker } from './components';
import { colors, convertHexToRGB, setColors } from '../colors';
import variables from '../variables';

export function createColorsGroup() {
  let group = createGroup('Colors');

  // TODO: add dropdown for color palette presets

  // Color pickers - one per state
  window.addEventListener('ruleUpdated', () => {
    let fieldset = group.querySelector('fieldset');

    if(fieldset != null) {
      fieldset.remove();
    }

    fieldset = document.createElement('fieldset');
    fieldset.classList.add('is-scrollable');

    let legend = document.createElement('legend');
    legend.classList.add('sr-only');
    legend.innerText = 'Colors';

    fieldset.appendChild(legend);

    colors.forEach((color, index) => {
      let label = variables.activeRule.historyEnabled ? 'Color stop ' + (index+1) : 'State ' + index;

      fieldset.appendChild(
        createColorPicker(label, color, (e) => {
          colors[index] = convertHexToRGB(e.target.value);
          setColors();
        })
      );
    });

    group.appendChild(fieldset);
  });

  return group;
}