import { createGroup, createColorPicker } from './components';
import { colors, convertHexToRGB, setColors } from '../colors';

export function createColorsGroup() {
  let group = createGroup('Colors');

  // TODO: add dropdown for color palette presets

  // Color pickers - one per state
  // TODO: abstract this to be based on variables.activeRule.stateCount
  colors.forEach((color, index) => {
    group.appendChild(
      createColorPicker('Color ' + (index+1), color, (e) => {
        colors[index] = convertHexToRGB(e.target.value);
        setColors();
      })
    );
  });

  return group;
}