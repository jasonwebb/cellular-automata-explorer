import fps from 'fps';

import { createGroup, createTextDisplay } from './components';

let totalGenerations, totalGenerationsTextDisplay,
    ticker, fpsTextDisplay;

export function createAnalysisGroup() {
  let group = createGroup('Analysis');

  // TODO: bar chart showing distribution of states

  // Total generation count
  totalGenerations = 0;

  totalGenerationsTextDisplay = group.appendChild(
    createTextDisplay('Total generations', totalGenerations)
  );

  // FPS count
  fpsTextDisplay = group.appendChild(
    createTextDisplay('FPS', 0)
  );

  ticker = fps({ every: 60 });

  ticker.on('data', (framerate) => {
    fpsTextDisplay.querySelector('.value').innerHTML = String(Math.round(framerate));
  });

  return group;
}

  export function updateGenerationCount(increment) {
    totalGenerations += increment;
    totalGenerationsTextDisplay.querySelector('.value').innerHTML = totalGenerations;
  }

  export function updateStats() {
    ticker.tick();
  }