varying vec2 v_uv;

uniform vec2 resolution;
uniform vec2 mousePosition;

uniform sampler2D states;
uniform int ruleFormat;

uniform sampler2D birthAndSurvivalCounts;
uniform int birthCountsLength;
uniform int survivalCountsLength;

// Rule formats
#define LIFE 0
#define EXTENDED_LIFE 1

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

  if(ruleFormat == LIFE || ruleFormat == EXTENDED_LIFE) {
  // Birth
  if(currentState == 0) {
    for(int i=0; i<9999; i++) {
      if(i < birthCountsLength) {
        if(liveNeighbors == int(texture2D(birthAndSurvivalCounts, vec2(.5 * float(i), 0)).r * 255.)) {
          nextState = 1;
        }
      } else {
        break;
      }
    }

    // Survival
    } else if(currentState == 1) {
    for(int i=0; i<9999; i++) {
      if(i < survivalCountsLength) {
        if(liveNeighbors == int(texture2D(birthAndSurvivalCounts, vec2(.5 * float(i), 0)).g * 255.)) {
          nextState = currentState;
        }
      } else {
        break;
      }
    }
  }
  }

  gl_FragColor = vec4(nextState, 0., 0., 1.);
}