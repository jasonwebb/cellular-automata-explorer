import { createGroup, createCountCheckboxFieldset } from './components';

export function createBirthGroup() {
  let group = createGroup('Birth');

  let countCheckboxFieldset = createCountCheckboxFieldset('birth');

  group.appendChild(countCheckboxFieldset);

  return group;
}