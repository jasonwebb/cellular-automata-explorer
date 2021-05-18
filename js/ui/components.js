let idCounter = 0;

/****************************
  Panel
*****************************/
export function createPanel() {
  let panel = document.createElement('div');
  panel.classList.add('panel');

  return panel;
}

/****************************
  Group
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
*****************************/
export function createButton(buttonText, listener) {
  // <button> tag
  let button = document.createElement('button');
  button.innerText = buttonText;

  // Run the provided callback when activated
  button.addEventListener('click', listener);

  return button;
}

/****************************
  Slider
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
  slider.setAttribute('value', 1.0);

  // Small text field with live value
  let textField = document.createElement('input');
  textField.setAttribute('type', 'text');
  textField.setAttribute('aria-label', labelText + ' value');
  textField.setAttribute('value', initialValue);
  textField.classList.add('value');

  // Update the live value in the text field and run the provided callback when the value changes
  slider.addEventListener('input', (e) => {
    textField.value = e.target.value;
    listener();
  });

  component.appendChild(label);
  component.appendChild(slider);
  component.appendChild(textField);

  idCounter++;

  return component;
}

/****************************
  Checkbox
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
  checkbox.setAttribute('checked', initialValue);
  checkbox.addEventListener('change', listener);

  component.appendChild(label);
  component.appendChild(checkbox);

  idCounter++;

  return component;
}