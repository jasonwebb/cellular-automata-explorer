import { createGroup, createDropdown, createSlider, createTextarea, createSeperator } from './components';
import { InitialPatternTypes } from '../patterns';
import variables from '../variables';

export function createPatternGroup() {
  let group = createGroup('Starting pattern');

  // Dropdown for patterns
  group.appendChild(
    createDropdown('Starting pattern', InitialPatternTypes, variables.activePattern, (e) => {
      variables.activePattern = e.target.value;
      window.dispatchEvent(new Event('patternChanged'));
    })
  );

  // Sub-panels with options for each pattern
  window.addEventListener('patternChanged', () => {
    // Get rid of any previously-added components
    group.querySelectorAll('.component:not(:first-of-type), hr').forEach((component) => {
      component.remove();
    });

    if(variables.activePattern != 'Empty') {
      group.appendChild( createSeperator() );
    }

    switch(variables.activePattern) {
      case 'Circle':
        // Diameter slider
        group.appendChild(
          createSlider('Diameter', variables.patterns.circle.diameter.min, variables.patterns.circle.diameter.max, 1, variables.patterns.circle.diameter.value, (e) => {
            variables.patterns.circle.diameter.value = e.target.value;
          })
        );

        break;

      case 'Rectangle':
        // Width slider
        group.appendChild(
          createSlider('Width', variables.patterns.rectangle.width.min, variables.patterns.rectangle.width.max, 1, variables.patterns.rectangle.width.value, (e) => {
            variables.patterns.rectangle.width.value = e.target.value;
          })
        );

        // Height slider
        group.appendChild(
          createSlider('Height', variables.patterns.rectangle.height.min, variables.patterns.rectangle.height.max, 1, variables.patterns.rectangle.height.value, (e) => {
            variables.patterns.rectangle.height.value = e.target.value;
          })
        );

        // Rotation slider
        group.appendChild(
          createSlider('Rotation', variables.patterns.rectangle.rotation.min, variables.patterns.rectangle.rotation.max, 1, variables.patterns.rectangle.rotation.value, (e) => {
            variables.patterns.rectangle.rotation.value = e.target.value;
          })
        );

        break;

      case 'Text':
        // String - textarea
        group.appendChild(
          createTextarea('String', variables.patterns.text.string, 2, (e) => {

          })
        );

        // Font face - dropdown
        group.appendChild(
          createDropdown('Font face', variables.patterns.text.fontFaceOptions, variables.patterns.text.activeFontFace, (e) => {
            variables.patterns.text.activeFontFace = e.target.value;
          })
        );

        // Font weight - slider
        group.appendChild(
          createSlider('Font weight', variables.patterns.text.fontWeight.min, variables.patterns.text.fontWeight.max, 100, variables.patterns.text.fontWeight.value, (e) => {
            variables.patterns.text.fontWeight.value = e.target.value;
          })
        );

        // Size - slider
        group.appendChild(
          createSlider('Font size', variables.patterns.text.size.min, variables.patterns.text.size.max, 1, variables.patterns.text.size.value, (e) => {
            variables.patterns.text.size.value = e.target.value;
          })
        );

        // Rotation - slider
        group.appendChild(
          createSlider('Rotation', variables.patterns.text.rotation.min, variables.patterns.text.rotation.max, 1, variables.patterns.text.rotation.value, (e) => {
            variables.patterns.text.rotation.value = e.target.value;
          })
        );

        break;

      case 'Image':
        // File upload
        // Position - x and y sliders
        // Rotation - slider
        // Scale - slider
        break;

      case 'Random':
        // Density
        group.appendChild(
          createSlider('Density', variables.patterns.random.density.min, variables.patterns.random.density.max, .01, variables.patterns.random.density.value, (e) => {
            variables.patterns.random.density.value = e.target.value;
          })
        );

        break;
    }
  });

  window.dispatchEvent(new Event('patternChanged'));

  return group
}