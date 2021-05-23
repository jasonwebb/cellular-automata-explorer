/**********************
 SCHEMA:
 {
   birth: array,
   neighbourhoodRange: int,
   neighbourhoodType: string ('moore' | ),
   process: function(),
   ruleFormat: string,
   ruleString: string,
   stateCount: int,
   survival: array
 }
***********************/
import * as THREE from 'three';
import * as parser from 'cellular-automata-rule-parser';

import { simulationUniforms } from './uniforms';
import variables from './variables';

export function setRule(ruleString) {
  let rule = parser(ruleString);

  if(rule != null) {
    // 1. [DONE] Convert rule.birth and rule.survival arrays into a single DataTexture, pass into simulationUniforms.birthAndSurvivalCounts.value
    // 2. [DONE] Pass rule.birth.length and rule.survival into simulationUniforms
    // 3. [DONE] Pass rule.ruleFormat ...
    // 4. Pass rule.neighbourhoodType ...
    // 5. Pass rule.neighbourhoodRange ...
    // 6. [DONE] Pass rule.stateCount ...

    // Convert the rule format to a number and pass to the shader
    let ruleFormatNumber = 0;

    switch(rule.ruleFormat) {
      case 'life':
        ruleFormatNumber = 0;
        rule.stateCount = 2;
        break;

      case 'extended-life':
        ruleFormatNumber = 1;
        rule.stateCount = 2;
        break;

      case 'generations':
        ruleFormatNumber = 2;
        break;
    }

    // Capture the rule information in a globally available object to display in the UI
    variables.activeRule.ruleFormat = ruleFormatNumber;
    variables.activeRule.stateCount = rule.stateCount;
    variables.activeRule.birth = rule.birth;
    variables.activeRule.survival = rule.survival;

    // Pass the rule format and state count to the shader
    simulationUniforms.ruleFormat.value = ruleFormatNumber;
    simulationUniforms.stateCount.value = rule.stateCount;

    // Pass the number birth and survival counts to the shader
    simulationUniforms.birthCountsLength.value = rule.birth.length;
    simulationUniforms.survivalCountsLength.value = rule.survival.length;

    // Convert the birth and survival arrays into a single DataTexture and pass it into the shader
    const longestLength = Math.max(rule.birth.length, rule.survival.length);
    let data = new Float32Array(longestLength * 4);  // RGBA = 4 channels

    for(let i=0; i<longestLength; i++) {
      data[i * 4] = i < rule.birth.length ? rule.birth[i] / 255 : 0;
      data[i * 4 + 1] = i < rule.survival.length ? rule.survival[i] / 255 : 0;
    }

    // Pass the birth and survival data to the shader as a data texture
    simulationUniforms.birthAndSurvivalCounts.value = new THREE.DataTexture(data, longestLength, 1, THREE.RGBAFormat, THREE.FloatType);

    window.dispatchEvent(new Event('ruleUpdated'));

  } else {
    console.log("Couldn't parse: " + ruleString);
  }
}