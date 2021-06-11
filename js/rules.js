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

export const NeighborhoodTypes = {
  'Moore': 0,
  'von Neumann': 1
};

export function setRule(ruleString) {
  let rule = parser(ruleString);

  if(rule != null) {
    // Convert the rule format to a number and pass to the shader
    let ruleFormatNumber = 0;   // default to Life format

    switch(rule.ruleFormat) {
      case 'life':          ruleFormatNumber = 0; break;
      case 'extended-life': ruleFormatNumber = 1; break;
      case 'generations':   ruleFormatNumber = 2; break;
    }

    // Capture the rule information in a globally-available object to display in the UI
    variables.activeRule.ruleFormat = ruleFormatNumber;
    variables.activeRule.stateCount = rule.stateCount || 2;
    variables.activeRule.birth = rule.birth;
    variables.activeRule.survival = rule.survival;
    variables.activeRule.neighborhoodType = rule.neighborhoodType || NeighborhoodTypes['Moore'];
    variables.activeRule.range = rule.neighborhoodRange || 1;
    variables.activeRule.includeCenter = true;

    console.log(variables.activeRule);

    // Pass the rule format and state count to the shader
    simulationUniforms.ruleFormat.value = variables.activeRule.ruleFormat;
    simulationUniforms.stateCount.value = variables.activeRule.stateCount;

    // Encode the birth and survival arrays into a texture and pass to the shader
    passNeighborCountsToShader(rule.birth, rule.survival);

    // Dispatch a custom event to let the UI know it needs to update
    window.dispatchEvent(new Event('ruleUpdated'));

  } else {
    console.log("Couldn't parse: " + ruleString);
  }
}

  function passNeighborCountsToShader(birth, survival) {
    // Pass the total numbers of birth and survival counts to the shader
    simulationUniforms.birthCountsLength.value = birth.length;
    simulationUniforms.survivalCountsLength.value = survival.length;

    // Convert the birth and survival arrays into a single DataTexture and pass it into the shader
    const longestLength = Math.max(birth.length, survival.length);
    let data = new Float32Array(longestLength * 4);  // RGBA = 4 channels

    for(let i=0; i<longestLength; i++) {
      data[i * 4] = i < birth.length ? birth[i] / 255 : 0;            // encode birth into R channel
      data[i * 4 + 1] = i < survival.length ? survival[i] / 255 : 0;  // encode survival into G channel
    }

    // Pass the birth and survival data to the shader as a data texture
    simulationUniforms.birthAndSurvivalCounts.value = new THREE.DataTexture(data, longestLength, 1, THREE.RGBAFormat, THREE.FloatType);
  }