varying vec2 v_uv;
uniform vec2 resolution;

uniform vec2 mousePosition;
uniform float brushRadius;

uniform sampler2D states;
uniform int ruleFormat;
uniform bool includeCenter;
uniform int neighborhoodType;
uniform int range;
uniform int stateCount;
uniform vec2 wrapping;

uniform sampler2D birthAndSurvivalCounts;
uniform int birthCountsLength;
uniform int survivalCountsLength;

vec2 texelStepSize;
float stateStepSize;

// Rule formats
const int LIFE = 0;
const int EXTENDED_LIFE = 1;
const int GENERATIONS = 2;

// Neighborhood types
const int VON_NEUMANN = 0;
const int MOORE = 1;

float getPreviousCellState(vec2 uv) {
  uv = vec2(
    bool(wrapping.x) ? mod(uv.x, 1.) : uv.x,
    bool(wrapping.y) ? mod(uv.y, 1.) : uv.y
  );

  return texture2D(states, uv)[0];
}

int getLiveNeighborCount() {
  int total = 0;

  // von Neumann neighborhood
  if(neighborhoodType == 0) {
    for(int row = -range; row <= range; row++) {
      for(int col = -range; col <= range; col++) {
        if(!includeCenter && row == 0 && col == 0) continue;
        total += getPreviousCellState(v_uv + vec2(1. / resolution.x * float(row), 1. / resolution.y * float(col))) >= stateStepSize ? 1 : 0;
      }
    }
  }

  return total;
}

void main() {
  texelStepSize = 1./resolution;
  stateStepSize = 1./float(stateCount - 1);

  float currentState = getPreviousCellState(v_uv);
  float nextState = 0.;
  int liveNeighbors = getLiveNeighborCount();

  // Life
  if(ruleFormat == LIFE || ruleFormat == EXTENDED_LIFE || ruleFormat == GENERATIONS) {
    // Birth
    if(currentState == 0.) {
      for(int i=0; i<9999; i++) {
        if(i < birthCountsLength) {
          if(liveNeighbors == int(texture2D(birthAndSurvivalCounts, vec2(1./float(birthCountsLength) * float(i), 0)).r * 255.)) {
            nextState = stateStepSize;
          }
        } else {
          break;
        }
      }

    // Survival
    } else if(currentState >= stateStepSize) {
      bool willSurvive = false;

      for(int i=0; i<9999; i++) {
        if(i < survivalCountsLength) {
          if(liveNeighbors == int(texture2D(birthAndSurvivalCounts, vec2(1./float(survivalCountsLength) * float(i), 0)).g * 255.)) {
            nextState = currentState;
            willSurvive = true;
          }
        } else {
          break;
        }
      }

      if(ruleFormat == GENERATIONS && !willSurvive) {
        nextState = mod(currentState + stateStepSize, 1.);
      }
    }
  }

  // Mouse painting - force this cell to a specific state when it is close to the mouse and the left mouse button is down.
  if(mousePosition.x > 0.0 && mousePosition.y > 0.0) {
    float distToMouse = distance(mousePosition * resolution, v_uv * resolution);

    if(distToMouse < brushRadius) {
      nextState = 1.;
    }
  }

  gl_FragColor = vec4(nextState, 0., 0., 1.);
}