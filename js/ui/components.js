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
  let group = document.createElement('div');
  group.classList.add('group');

  let heading = document.createElement('h2');
  heading.innerText = name;
  group.appendChild(heading);

  return group;
}

/****************************
  Dropdown
*****************************/
export function createDropdown(labelText, options, listener) {
  let component = document.createElement('div');
  component.classList.add('component');

  let label = document.createElement('label');
  label.innerText = labelText;

  let select = document.createElement('select');
  label.appendChild(select);

  options.forEach((option, index) => {
    let tag = document.createElement('option');
    tag.setAttribute('value', index);
    tag.innerText = option;
    select.appendChild(tag);
  });

  select.addEventListener('change', listener);

  component.appendChild(label);

  return component;
}

/****************************
  Button
*****************************/
export function createButton(buttonText, listener) {
  let button = document.createElement('button');
  button.innerText = buttonText;

  button.addEventListener('click', listener);

  return button;
}

/****************************
  Slider
*****************************/
export function createSlider(labelText, minValue, maxValue, stepSize, listener) {
  let component = document.createElement('div');
  component.classList.add('component');

  let label = document.createElement('label');
  label.innerText = labelText;

  let slider = document.createElement('input');
  slider.setAttribute('type', 'range');
  slider.setAttribute('min', minValue);
  slider.setAttribute('max', maxValue);
  slider.setAttribute('step', stepSize);
  slider.setAttribute('value', 1.0);
  label.appendChild(slider);

  slider.addEventListener('change', listener);

  component.appendChild(label);

  return component;
}

/****************************
  Checkbox
*****************************/
export function createCheckbox(labelText, initialValue, listener) {
  let component = document.createElement('div');
  component.classList.add('component');

  let label = document.createElement('label');
  label.innerText = labelText;

  let checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('checked', initialValue);
  checkbox.addEventListener('change', listener);
  label.appendChild(checkbox);

  component.appendChild(label);

  return component;
}