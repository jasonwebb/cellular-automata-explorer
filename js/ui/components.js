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

  // Options in <select> dropdown
  options.forEach((option, index) => {
    let tag = document.createElement('option');
    tag.setAttribute('value', index);
    tag.innerText = option;
    select.appendChild(tag);
  });

  // Run the provided callback when the value changes
  select.addEventListener('change', listener);

  component.appendChild(label);
  component.appendChild(select);

  idCounter++;

  return component;
}

/****************************
  Button
  - Buttons execute custom functions when they are activated.
*****************************/
export function createButton(buttonText, listener) {
  // Wrapper
  let component = document.createElement('div');
  component.classList.add('component', 'button');

  // <button> tag
  let button = document.createElement('button');
  button.innerText = buttonText;

  // Run the provided callback when activated
  button.addEventListener('click', listener);

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
  let checkboxes = [];

  // Fieldset (<fieldset>)
  let fieldset = document.createElement('fieldset');
  fieldset.classList.add('count-fieldset');

  // Legend (<legend>)
  let legend = document.createElement('legend');
  legend.classList.add('sr-only');
  legend.innerText = type === 'birth' ? 'Birth counts' : 'Survival counts';
  fieldset.appendChild(legend);

  // TODO: calculate total number of neighbors possible based on neighborhood type, range, and cyclic
  let totalNeighbors = 8;

  // Create all the checkboxes
  for(let i=0; i < totalNeighbors; i++) {
    let checkbox = createCountCheckbox(i);
    checkboxes.push(checkbox.querySelector('input'));
    fieldset.appendChild(checkbox);
  }

  // Check the checkboxes based on the active rule whenever it is set
  window.addEventListener('ruleUpdated', () => {
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
      let newValue = e.target.checked;

      switch(type) {
        case 'birth':
          // TODO: update simulationUniforms.birthAndSurvivalCounts
          // TODO: update simulationsUniforms.birthCountsLength
          // TODO: update activeRule.birth
          break;

        case 'survival':
          // TODO: update simulationUniforms.birthAndSurvivalCounts
          // TODO: update simulationsUniforms.survivalCountsLength
          // TODO: update activeRule.survival
          break;
      }

      // TODO: change Preset dropdown to "Custom"
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