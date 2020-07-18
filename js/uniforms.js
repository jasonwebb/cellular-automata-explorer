//==============================================================
//  UNIFORMS
//  - Uniforms are custom variables that get passed to the
//    shaders. They get set on the CPU, then used on the GPU.
//==============================================================

import * as THREE from 'three';
import { containerSize } from './globals';

export let simulationUniforms = {
  previousIterationTexture: {
    type: "t",
    value: undefined
  },
  resolution: {
    type: "v2",
    value: new THREE.Vector2(containerSize.width, containerSize.height)
  },
  mousePosition: {
    type: "v2",
    value: new THREE.Vector2(-1,-1)
  }
};

export let displayUniforms = {
  textureToDisplay: {
    value: null
  },
  previousIterationTexture: {
    value: null
  },
  time: {
    type: "f",
    value: 0
  },
  renderingStyle: {
    type: "i",
    value: 0
  }
};

export let passthroughUniforms = {
  textureToDisplay: {
    value: null
  }
};