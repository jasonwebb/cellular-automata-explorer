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