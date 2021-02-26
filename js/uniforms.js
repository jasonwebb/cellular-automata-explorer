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
  previousGenerationStates: {
    type: 't',
    value: null
  },
  birthAndSurvivalCounts: {
    type: 't',
    value: null
  },
  birthCountsLength: {
    type: 'i',
    value: 1
  },
  survivalCountsLength: {
    type: 'i',
    value: 2
  }
};

export let displayUniforms = {
  previousGenerationStates: {
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