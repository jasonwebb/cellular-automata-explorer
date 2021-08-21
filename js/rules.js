/**********************
 Structure of object returned by the parser:
 {
   birth: array,
   neighbourhoodRange: int,
   neighbourhoodType: string ('moore' | ...),
   process: function(),
   ruleFormat: string ('life' | 'extended-life' | 'generations' | ...),
   ruleString: string,
   stateCount: int,
   survival: array
 }
***********************/
import * as THREE from 'three';
import * as parser from 'cellular-automata-rule-parser';

import { simulationUniforms } from './uniforms';
import variables from './variables';
import presets from './presets';

export const NeighborhoodTypes = {
  'Moore': 0,
  'von Neumann': 1
};

export function setRule(ruleString) {
  let rule = parser(ruleString);

  if(rule == null) {
    console.log("Couldn't parse: " + ruleString);
    return;
  }

  // Convert the rule format to a number and pass to the shader
  let ruleFormatNumber = 0;   // default to Life format

  switch(rule.ruleFormat) {
    case 'life':          ruleFormatNumber = 0; break;
    case 'extended-life': ruleFormatNumber = 1; break;
    case 'generations':   ruleFormatNumber = 2; break;
  }

  // Capture the rule information in a globally-available object to display in the UI
  variables.activeRule.ruleString = ruleString;
  variables.activeRule.ruleFormat = ruleFormatNumber;
  variables.activeRule.stateCount = rule.stateCount || 2;
  variables.activeRule.birth = rule.birth;
  variables.activeRule.survival = rule.survival;
  variables.activeRule.neighborhoodType = rule.neighborhoodType || NeighborhoodTypes['Moore'];
  variables.activeRule.range = rule.neighborhoodRange || 1;
  variables.activeRule.includeCenter = false;
  variables.activeRule.historyEnabled = rule.ruleFormat === 'generations' ? true : false;
  variables.activeRule.cyclicEnabled = true;

  // Pass all the rule information to the shader
  simulationUniforms.ruleFormat.value = variables.activeRule.ruleFormat;
  simulationUniforms.stateCount.value = variables.activeRule.stateCount;
  simulationUniforms.neighborhoodType.value = variables.activeRule.neighborhoodType;
  simulationUniforms.range.value = variables.activeRule.range;
  simulationUniforms.includeCenter.value = variables.activeRule.includeCenter;

  // Encode the birth and survival arrays into a texture and pass to the shader
  passNeighborCountsToShader();

  // Select the appropriate preset in the Rule panel, if it matches.
  Object.keys(presets).forEach((family) => {
    const key = Object.keys(presets[family]).find(key => presets[family][key] === ruleString);

    if(key !== undefined) {
      let presetsDropdown = document.getElementById('input-0');

      presetsDropdown.querySelectorAll('optgroup').forEach((optgroup) => {
        if(optgroup.getAttribute('label') === family) {
          optgroup.querySelectorAll('option').forEach((option) => {
            if(option.innerText === key) {
              option.setAttribute('selected', 'selected');
            } else {
              option.removeAttribute('selected');
            }
          });
        }
      });
    }
  });

  // Fire a custom event to let the UI know it needs to update
  window.dispatchEvent(new Event('ruleUpdated'));
}

  export function passNeighborCountsToShader() {
    // Pass the total numbers of birth and survival counts to the shader
    simulationUniforms.birthCountsLength.value = variables.activeRule.birth.length;
    simulationUniforms.survivalCountsLength.value = variables.activeRule.survival.length;

    // Convert the birth and survival arrays into a single DataTexture and pass it into the shader
    const longestLength = Math.max(variables.activeRule.birth.length, variables.activeRule.survival.length);
    let data = new Float32Array(longestLength * 4);  // RGBA = 4 channels

    for(let i=0; i<longestLength; i++) {
      data[i * 4] = i < variables.activeRule.birth.length ? variables.activeRule.birth[i] / 255 : 0;            // encode birth into R channel
      data[i * 4 + 1] = i < variables.activeRule.survival.length ? variables.activeRule.survival[i] / 255 : 0;  // encode survival into G channel
    }

    // Pass the birth and survival data to the shader as a data texture
    simulationUniforms.birthAndSurvivalCounts.value = new THREE.DataTexture(data, longestLength, 1, THREE.RGBAFormat, THREE.FloatType);
  }