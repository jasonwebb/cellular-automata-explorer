import { createGroup, createCountCheckboxFieldset } from './components';

export function createSurvivalGroup() {
  let group = createGroup('Survival');

  let countCheckboxFieldset = createCountCheckboxFieldset('survival');

  group.appendChild(countCheckboxFieldset);

  return group;
}