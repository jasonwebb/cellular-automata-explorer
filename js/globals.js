import * as THREE from 'three';

export default {
  isPaused: false,
  pingPongSteps: 1,
  currentRenderTargetIndex: 0,
  clock: new THREE.Clock()
}