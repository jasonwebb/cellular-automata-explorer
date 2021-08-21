export default {
  canvas: {
    width: {
      min: 1,
      max: window.innerWidth,
      value: 900
    },
    height: {
      min: 1,
      max: window.innerHeight,
      value: 900
    },
    maximized: false,
    unmaximizedSize: {
      width: null,
      height: null
    },
    wrap: {
      x: true,
      y: true
    },
    scale: {
      min: .01,
      max: 5,
      value: 1
    },
  },
  patterns: {
    circle: {
      diameter: {
        min: 1,
        max: 900,
        value: 200
      }
    },
    rectangle: {
      width: {
        min: 1,
        max: 900,
        value: 400
      },
      height: {
        min: 1,
        max: 900,
        value: 400
      },
      rotation: {
        min: 0,
        max: 360,
        value: 0
      }
    },
    text: {
      string: 'Hello world!',
      size: {
        min: 1,
        max: 200,
        value: 100
      },
      rotation: {
        min: 0,
        max: Math.PI,
        value: 0
      }
    },
    random: {
      density: {
        min: .01,
        max: 1.0,
        value: .2
      }
    }
  },
  activePattern: 'Rectangle',
  activeRule: {
    birth: null,
    survival: null,
    stateCount: null,
    range: null,
    neighborhoodType: null,
    includeCenter: null,
    historyEnabled: null
  }
}