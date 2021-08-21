import { createGroup, createColorPicker } from './components';
import { colors, convertHexToRGB, setColors } from '../colors';

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
      fieldset.appendChild(
        createColorPicker('Color ' + (index+1), color, (e) => {
          colors[index] = convertHexToRGB(e.target.value);
          setColors();
        })
      );
    });

    group.appendChild(fieldset);
  });

  return group;
}