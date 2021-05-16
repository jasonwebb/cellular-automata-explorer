export function createPanel(headingText, backgroundColor) {
  let panel = document.createElement('div');
  panel.classList.add('panel');
  panel.style.backgroundColor = backgroundColor;

  let heading = document.createElement('h2');
  heading.classList.add('heading');
  heading.innerText = headingText;
  panel.appendChild(heading);

  return panel;
}

export function createDropdown(labelText, options, listener) {
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

  return label;
}

export function createButton(buttonText, listener) {
  let button = document.createElement('button');
  button.innerText = buttonText;

  button.addEventListener('click', listener);

  return button;
}

export function createSlider(labelText, minValue, maxValue, stepSize, listener) {
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

  return label;
}

export function createCheckbox(labelText, initialValue, listener) {
  let label = document.createElement('label');
  label.innerText = labelText;

  let checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('checked', initialValue);
  checkbox.addEventListener('change', listener);
  label.appendChild(checkbox);

  return label;
}