import { convertRGBtoHex } from '../colors';
import { NeighborhoodTypes, passNeighborCountsToShader } from '../rules';
import variables from '../variables';

let idCounter = 0;

/****************************
  Panel
  - Panels contain collections of Groups.
  - Panels are the highest level wrappers in the UI.
*****************************/
export function createPanel() {
  let panel = document.createElement('div');
  panel.classList.add('panel');

  return panel;
}

/****************************
  Group
  - Groups contain collections of Components.
  - Groups are the "sections" of the Panels, and they have headings at the top.
*****************************/
export function createGroup(name) {
  // Wrapper
  let group = document.createElement('div');
  group.classList.add('group');

  // Heading
  let heading = document.createElement('h2');
  heading.classList.add('heading');
  heading.innerText = name;
  group.appendChild(heading);

  return group;
}

/*******************
  Seperator
  - Seperators are <hr> tags that can break up sets of related Components inside Groups
********************/
export function createSeperator() {
  return document.createElement('hr');
}

/****************************
  Dropdown
  - Dropdowns are <select> tags with associated <label>s.
*****************************/
export function createDropdown(labelText, options, listener) {
  // Wrapper
  let component = document.createElement('div');
  component.classList.add('component', 'dropdown');

  // <label> tag associated with <select>
  let label = document.createElement('label');
  label.setAttribute('for', 'input-' + idCounter);
  label.innerText = labelText;

  // <select> dropdown
  let select = document.createElement('select');
  select.setAttribute('id', 'input-' + idCounter);

  // Options (<option>s)
  Object.values(options).forEach((value, index) => {
    // If the options contain nested arrays, that means it has sections and should be built with <optgroup>s
    // TODO: native <optgroup>s are not accessible, so in the future this should be rebuilt as a custom select.
    if(Array.isArray(value)) {
      let groupTitle = Object.keys(options)[index];
      let optgroup = document.createElement('optgroup');
      optgroup.setAttribute('label', groupTitle);

      Object.values(options)[index].forEach((optionName) => {
        let option = document.createElement('option');
        option.innerText = optionName;
        optgroup.appendChild(option);
      });

      select.appendChild(optgroup);

    // If the options don't contain nested arrays, we'll assume they are just simple strings.
    } else {
      let tag = document.createElement('option');
      tag.innerText = value;
      select.appendChild(tag);
    }
  });

  // Run the provided callback when the value changes
  select.addEventListener('change', listener);

  // Prevent Space key from bubbling up and pausing the simulation
  select.addEventListener('keydown', (e) => {
    if(e.key == ' ') {
      e.stopPropagation();
    }
  });

  component.appendChild(label);
  component.appendChild(select);

  idCounter++;

  return component;
}

/****************************
  Button
  - Buttons execute custom functions when they are activated.
*****************************/
export function createButton(buttonText, isIndented = false, listener) {
  // Wrapper
  let component = document.createElement('div');
  component.classList.add('component', 'button');

  // Add class if this button needs to be indented
  if(isIndented) {
    component.classList.add('is-indented');
  }

  // <button> tag
  let button = document.createElement('button');
  button.innerText = buttonText;

  // Run the provided callback when activated
  button.addEventListener('click', listener);

  // Prevent Space key from bubbling up and pausing the simulation
  button.addEventListener('keydown', (e) => {
    if(e.key == ' ') {
      e.stopPropagation();
    }
  });

  component.appendChild(button);

  return component;
}

/****************************
  Slider
  - Sliders are range inputs (<input type="range">).
  - Sliders have a <label> on the left.
  - Sliders have a text input on the right, which updates in real-time with the value of the range slider (and vice versa).
*****************************/
export function createSlider(labelText, minValue, maxValue, stepSize, initialValue, listener) {
  // Wrapper
  let component = document.createElement('div');
  component.classList.add('component', 'slider');

  // <label> tag associated with slider
  let label = document.createElement('label');
  label.setAttribute('for', 'input-' + idCounter);
  label.innerText = labelText;

  // Slider (<input type="range" ...>)
  let slider = document.createElement('input');
  slider.setAttribute('id', 'input-' + idCounter);
  slider.setAttribute('type', 'range');
  slider.setAttribute('min', minValue);
  slider.setAttribute('max', maxValue);
  slider.setAttribute('step', stepSize);
  slider.setAttribute('value', initialValue);

  // Small text field with live value
  let textField = document.createElement('input');
  textField.setAttribute('type', 'text');
  textField.setAttribute('aria-label', labelText + ' value');
  textField.setAttribute('value', initialValue);
  textField.classList.add('value');

  // Update the live value in the text field and run the provided callback when the value changes
  slider.addEventListener('input', (e) => {
    textField.value = e.target.value;
    listener(e);
  });

  // Update the range slider whenever the text field is edited directly
  textField.addEventListener('change', (e) => {
    slider.value = e.target.value;
    listener(e);
  });

  component.appendChild(label);
  component.appendChild(slider);
  component.appendChild(textField);

  idCounter++;

  return component;
}

/****************************
  Checkbox
  - Checkboxes are native <input type="checkbox"> tags that are visible ony to screen readers.
  - Checkboxes are styled using a visible adjacent element and CSS.
*****************************/
export function createCheckbox(labelText, initialValue, listener) {
  // Wrapper
  let component = document.createElement('div');
  component.classList.add('component', 'checkbox');

  // <label> tag associated with checkbox
  let label = document.createElement('label');
  label.setAttribute('for', 'input-' + idCounter);
  label.innerText = labelText;

  // Checkbox (<input type="checkbox" ...>)
  let checkbox = document.createElement('input');
  checkbox.setAttribute('id', 'input-' + idCounter);
  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('sr-only');  // hidden visually, but reachable by keyboard and screen reader

  if(initialValue === true) {
    checkbox.setAttribute('checked', 'checked');
  }

  checkbox.addEventListener('change', listener);

  // Custom styled checkbox
  let customCheckbox = document.createElement('div');
  customCheckbox.classList.add('custom-checkbox');

  // Toggle the real checkbox when the custom checkbox is clicked
  customCheckbox.addEventListener('click', () => {
    const isChecked = checkbox.getAttribute('checked') === 'checked' ? true : false;

    if(isChecked) {
      checkbox.removeAttribute('checked');
    } else {
      checkbox.setAttribute('checked', 'checked');
    }
  });

  // Prevent Space key from bubbling up and pausing the simulation
  checkbox.addEventListener('keydown', (e) => {
    if(e.key == ' ') {
      e.stopPropagation();
    }
  });

  component.appendChild(label);
  component.appendChild(checkbox);
  component.appendChild(customCheckbox);

  idCounter++;

  return component;
}

/*******************************************************
  Fieldset of checkboxes for birth and survival counts

  <fieldset>
    <legend>...</legend>
    ...
  </fieldset>
********************************************************/
export function createCountCheckboxFieldset(type) {
  // Fieldset (<fieldset>)
  let fieldset = document.createElement('fieldset');
  fieldset.classList.add('count-fieldset', 'is-scrollable');

  // Legend (<legend>)
  let legend = document.createElement('legend');
  legend.classList.add('sr-only');
  legend.innerText = type === 'birth' ? 'Birth counts' : 'Survival counts';
  fieldset.appendChild(legend);

  // Build and check the checkboxes based on the active rule whenever it is set
  window.addEventListener('ruleUpdated', () => {
    let checkboxes = [];

    // Remove any checkboxes that were previously added to the group
    fieldset.querySelectorAll('label').forEach((label) => {
      label.remove();
    });

    let totalPossibleNeighbors = 0;

    // Calculate how many neighbors are possible
    switch(variables.activeRule.neighborhoodType) {
      case NeighborhoodTypes['Moore']:
        totalPossibleNeighbors = Math.pow(2 * variables.activeRule.range + 1, 2);  // equation: (2r + 1)^2
        totalPossibleNeighbors -= !variables.activeRule.includeCenter ? 1 : 0;     // subtract 1 if the center is not included
        break;

      case NeighborhoodTypes['von Neumann']:
        totalPossibleNeighbors = 2 * variables.activeRule.range * (variables.activeRule.range + 1);  // equation: 2r(r+1)
        totalPossibleNeighbors += variables.activeRule.includeCenter ? 1 : 0;                        // add 1 if the center is included
        break;

      default:
        console.log('Invalid neighborhood type: ' + variables.activeRule.neighborhoodType);
        break;
    }

    // Create one checkbox for each possible neighbor count
    for(let i=0; i < totalPossibleNeighbors; i++) {
      let checkbox = createCountCheckbox(i, type);
      checkboxes.push(checkbox.querySelector('input'));
      fieldset.appendChild(checkbox);
    }

    // Check all the checkboxes that represent the appropriate neighbor counts
    const checkedCounts = type === 'birth' ? variables.activeRule.birth : variables.activeRule.survival;

    checkedCounts.forEach((index) => {
      checkboxes[index].setAttribute('checked', 'checked');
    });
  });

  return fieldset;
}

  /**
    Single count checkbox

    <label>
      <input type="checkbox" class="sr-only">
      <div class="custom-checkbox"></div>
      <div class="text">...</div>
    </label>
  */
  function createCountCheckbox(countNumber, type) {
    // Wrapper (<label>)
    let label = document.createElement('label');
    label.classList.add('checkbox');

    // Checkbox (<input type="checkbox">)
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('sr-only');

    checkbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;

      switch(type) {
        case 'birth':
          const isInBirthArray = variables.activeRule.birth.includes(countNumber);

          // If checked, add it to the birth array if it isn't there already
          if(isChecked && !isInBirthArray) {
            variables.activeRule.birth.push(countNumber);
          }

          // If unchecked, remove it from the birth array if it exists
          else if(!isChecked && isInBirthArray) {
            variables.activeRule.birth.splice(variables.activeRule.birth.indexOf(countNumber), 1);
          }

          break;

        case 'survival':
          const isInSurvivalArray = variables.activeRule.survival.includes(countNumber);

          // If checked, add it to the survival array if it isn't there already
          if(isChecked && !isInSurvivalArray) {
            variables.activeRule.survival.push(countNumber);
          }

          // If unchecked, remove it from the survival array if it exists
          else if(!isChecked && isInSurvivalArray) {
            variables.activeRule.survival.splice(variables.activeRule.survival.indexOf(countNumber), 1);
          }

          break;
      }

      // TODO: change Preset dropdown to "Custom"
      // TODO: update variables.activeRule.ruleString
      // TODO: update the rule string text field

      passNeighborCountsToShader();
    });

    // Prevent Space key from bubbling up and pausing the simulation
    checkbox.addEventListener('keydown', (e) => {
      if(e.key == ' ') {
        e.stopPropagation();
      }
    });

    // Custom styled checkbox
    let customCheckbox = document.createElement('div');
    customCheckbox.classList.add('custom-checkbox');

    // Number text under checkbox
    let text = document.createElement('div');
    text.classList.add('text');
    text.innerText = countNumber;

    label.appendChild(checkbox);
    label.appendChild(customCheckbox);
    label.appendChild(text);

    return label;
  }

/*******************************
  Color picker
  - Color pickers are native <input type="color">s
********************************/
export function createColorPicker(labelText, initialValue, listener) {
  let component = document.createElement('div');
  component.classList.add('component', 'color-picker');

  // Label (<label>)
  let label = document.createElement('label');
  label.setAttribute('for', 'input-' + idCounter);
  label.innerText = labelText;

  // Color picker (<input type="color")
  let colorpicker = document.createElement('input');
  colorpicker.setAttribute('type', 'color');
  colorpicker.setAttribute('value', convertRGBtoHex(initialValue));
  colorpicker.setAttribute('id', 'input-' + idCounter);

  colorpicker.addEventListener('input', listener);

  component.appendChild(label);
  component.appendChild(colorpicker);

  idCounter++;

  return component;
}

/*******************************
  Text input
  - Text inputs are native <input type="text">s
********************************/
export function createTextInput(labelText, initialValue, listener) {
  let component = document.createElement('div');
  component.classList.add('component', 'text-input');

  // Label (<label>)
  let label = document.createElement('label');
  label.setAttribute('for', 'input-' + idCounter);
  label.innerText = labelText;

  // Text input (<input type="text">)
  let textInput = document.createElement('input');
  textInput.setAttribute('type', 'text');
  textInput.setAttribute('value', initialValue);
  textInput.setAttribute('id', 'input-' + idCounter);

  textInput.addEventListener('input', listener);

  // Prevent Space key from bubbling up and pausing the simulation
  textInput.addEventListener('keydown', (e) => {
    if(e.key == ' ') {
      e.stopPropagation();
    }
  });

  component.appendChild(label);
  component.appendChild(textInput);

  idCounter++;

  return component;
}