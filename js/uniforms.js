//==============================================================
//  UNIFORMS
//  - Uniforms are custom variables that get passed to the
//    shaders. They get set on the CPU, then used on the GPU.
//==============================================================

import * as THREE from 'three';
import variables from './variables';

export let simulationUniforms = {
  resolution: {
    type: 'v2',
    value: new THREE.Vector2(
      variables.canvas.width.value * variables.scale.value,
      variables.canvas.height.value * variables.scale.value
    )
  },
  mousePosition: {
    type: 'v2',
    value: new THREE.Vector2(-1,-1)
  },
  brushRadius: {
    type: "f",
    value: 10.0
  },
  states: {
    type: 't',
    value: null
  },
  ruleFormat: {  // int matching constants in the frag shader, used to activate different rule logic
    type: 'i',
    value: 0
  },
  includeMiddle: {
    type: 'b',
    value: false
  },
  range: {
    type: 'i',
    value: 1
  },
  stateCount: {  // number of states
    type: 'i',
    value: 2
  },
  wrapping: {
    type: 'v2',
    value: new THREE.Vector2(1,1)
  },
  birthAndSurvivalCounts: {
    type: 't',
    value: null
  },
  birthCountsLength: {
    type: 'i',
    value: null
  },
  survivalCountsLength: {
    type: 'i',
    value: null
  }
};

export let displayUniforms = {
  textureToDisplay: {
    type: 't',
    value: null
  },
  time: {
    type: 'f',
    value: 0
  },
  renderingStyle: {
    type: 'i',
    value: 0
  },
  colors: {
    type: 't',
    value: null
  }
};

export let passthroughUniforms = {
  textureToDisplay: {
    type: 't',
    value: null
  }
};