//==============================================================
//  RENDER TARGETS
//  - Render targets are invisible buffers that we can send
//    data to in the form of textures.
//  - In render(), the simulation shaders store computation
//    results as textures and pass these results between two
//    render targets to run multiple iterations per frame.
//==============================================================

import * as THREE from 'three';
import variables from './variables';

export let renderTargets;

export function setupRenderTargets() {
  renderTargets = [];

  // Create two render targets so we can "ping pong" between them and run multiple iterations per frame
  for(let i=0; i<2; i++) {
    renderTargets.push(
      new THREE.WebGLRenderTarget(
        variables.canvas.width.value,
        variables.canvas.height.value,
        {
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.FloatType
        }
      )
    );
  }
}