import { createGroup, createTextDisplay } from './components';

let totalGenerations, totalGenerationsTextDisplay;

export function createAnalysisGroup() {
  let group = createGroup('Analysis');

  // TODO: bar chart showing distribution of states

  // Total generation count
  totalGenerations = 0;

  totalGenerationsTextDisplay = group.appendChild(
    createTextDisplay('Total generations', totalGenerations)
  );

  // TODO: FPS

  return group;
}

  export function incrementGenerationCount() {
    totalGenerations++;
    totalGenerationsTextDisplay.querySelector('.value').innerHTML = totalGenerations;
  }