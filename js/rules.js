import * as THREE from 'three';
import * as parser from 'cellular-automata-rule-parser';

import { simulationUniforms, displayUniforms } from './uniforms';
import presets from './presets';
import variables from './variables';

export const NeighborhoodTypes = {
  'Moore': 0,
  'von Neumann': 1
};

/**********************
  Abstraction for parsing either rule strings or objects containing rule data
***********************/
export function setRule(ruleInput) {
  if(typeof ruleInput === 'string') {
    setRuleFromString(ruleInput);
  } else {
    setRuleFromData(ruleInput);
  }
}

export function setRuleFromData(ruleData) {
  // Capture the rule information in a globally-available object to display in the UI
  variables.activeRule.ruleString = ruleData.ruleString || '';
  variables.activeRule.ruleFormat = ruleData.ruleFormatNumber || 0;
  variables.activeRule.stateCount = ruleData.stateCount || 2;
  variables.activeRule.birth = ruleData.birth || [3];
  variables.activeRule.survival = ruleData.survival || [2,3];
  variables.activeRule.neighborhoodType = ruleData.neighborhoodType || NeighborhoodTypes['Moore'];
  variables.activeRule.range = ruleData.range || 1;
  variables.activeRule.includeCenter = ruleData.includeCenter || false;
  variables.activeRule.historyEnabled = ruleData.historyEnabled ? true : false;
  variables.activeRule.cyclicEnabled = ruleData.cyclicEnabled || true;

  // Pass all the rule information to the simulation frag shader
  simulationUniforms.ruleFormat.value = variables.activeRule.ruleFormat;
  simulationUniforms.stateCount.value = variables.activeRule.stateCount;
  simulationUniforms.neighborhoodType.value = variables.activeRule.neighborhoodType;
  simulationUniforms.range.value = variables.activeRule.range;
  simulationUniforms.includeCenter.value = variables.activeRule.includeCenter;
  simulationUniforms.historyEnabled.value = variables.activeRule.historyEnabled;
  simulationUniforms.cyclicEnabled.value = variables.activeRule.cyclicEnabled;

  // Pass any relevant rule information to the display shader for rendering
  displayUniforms.historyEnabled.value = simulationUniforms.historyEnabled.value;

  // Encode the birth and survival arrays into a texture and pass to the shader
  passNeighborCountsToShader();

  // Select the appropriate preset in the Rule panel, if it matches.
  Object.keys(presets).forEach((family) => {
    const key = Object.keys(presets[family]).find(key => presets[family][key] === ruleData.ruleString);

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
  window.dispatchEvent(new Event('rebuildUI'));
}

/**********************
  Set the active rule from a string using kchapelier's cellular-automata-rule-parser package (https://github.com/kchapelier/cellular-automata-rule-parser)

  This package only supports Life, Larger than Life, and Generations rule families (along with a few other, more esoteric ones). See the README in the package's repo for format documentation.

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
export function setRuleFromString(ruleString) {
  let rule = parser(ruleString);

  if(rule == null) {
    console.log("Couldn't parse: " + ruleString);
    return;
  }

  // Convert the rule format to a number so it can be passed to the frag shader more easily
  let ruleFormatNumber = 0;   // default to Life format

  switch(rule.ruleFormat) {
    case 'life':          ruleFormatNumber = 0; break;
    case 'extended-life': ruleFormatNumber = 1; break;
    case 'generations':   ruleFormatNumber = 2; break;
  }

  // Capture the parsed rule data in a custom object and pass it onto the core rule setting function
  let ruleData = {};
  ruleData.ruleString = ruleString;
  ruleData.ruleFormat = ruleFormatNumber;
  ruleData.stateCount = rule.stateCount || 2;
  ruleData.birth = rule.birth;
  ruleData.survival = rule.survival;
  ruleData.neighborhoodType = rule.neighborhoodType || NeighborhoodTypes['Moore'];
  ruleData.range = rule.neighborhoodRange || 1;
  ruleData.historyEnabled = rule.stateCount > 2 ? true : false;

  setRuleFromData(ruleData);
}

/**********************
  Abstracted utility function for converting the birth/survival counts from arrays to DataTextures so they can be passed to the frag shader. Called in this file, and in ./ui/rules.js
***********************/
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