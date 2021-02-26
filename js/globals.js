import * as THREE from 'three';

export default {
  isPaused: false,
  pingPongSteps: 60,
  currentRenderTargetIndex: 0,
  clock: new THREE.Clock()
}