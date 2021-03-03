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
  states: {
    type: 't',
    value: null
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
  }
};

export let passthroughUniforms = {
  textureToDisplay: {
    type: 't',
    value: null
  }
};