varying vec2 v_uv;

uniform vec2 resolution;
uniform vec2 mousePosition;

uniform sampler2D states;

uniform sampler2D birthAndSurvivalCounts;
uniform int birthCountsLength;
uniform int survivalCountsLength;

int getPreviousCellState(vec2 uv) {
  return int(texture2D(states, uv)[0]);
}

int getLiveNeighborCount() {
  int total = 0;

  // von Neumann neighborhood
  for(float row = -1.; row <= 1.; row++) {
    for(float col = -1.; col <= 1.; col++) {
      if(row == 0. && col == 0.)  continue;
      total += getPreviousCellState(v_uv + vec2(1. / resolution.x * row, 1. / resolution.y * col));
    }
  }

  return total;
}

void main() {
  vec2 stepSize = 1. / resolution;
  int currentState = getPreviousCellState(v_uv);
  int nextState = 0;
  int liveNeighbors = getLiveNeighborCount();

  // if(liveNeighbors == 3) {
  //   nextState = 1;
  // } else if(liveNeighbors == 2) {
  //   nextState = currentState;
  // } else {
  //   nextState = 0;
  // }

  // Birth
  if(currentState == 0) {
    for(int i=0; i<9999; i++) {
      if(i < birthCountsLength) {
        if(liveNeighbors == 3) {
        // if(liveNeighbors == int(texture2D(birthAndSurvivalCounts, vec2(.5 * float(i), 0))[0])) {
          nextState = 1;
        }
      } else {
        break;
      }
    }
  }

  // Survive
  if(currentState == 1) {
    for(int i=0; i<9999; i++) {
      if(i < survivalCountsLength) {
        if(liveNeighbors == 2 || liveNeighbors == 3) {
        // if(liveNeighbors == int(texture2D(birthAndSurvivalCounts, vec2(.5 * float(i), 0))[1])) {
          nextState = currentState;
        }
      } else {
        break;
      }
    }
  }

  gl_FragColor = vec4(nextState, 0., 0., 1.);
}