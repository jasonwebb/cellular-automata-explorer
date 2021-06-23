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
      radius: {
        min: 0.1,
        max: 5,
        value: 200
      }
    },
    rectangle: {
      width: {
        min: 1,
        max: window.innerWidth,
        value: 400
      },
      height: {
        min: 1,
        max: window.innerHeight,
        value: 400
      },
      rotation: {
        min: 0,
        max: Math.PI,
        value: 0
      }
    },
    text: {
      size: {
        min: 1,
        max: 100,
        value: 200
      },
      rotation: {
        min: 0,
        max: Math.PI,
        value: 0
      },
      value: 'CA'
    }
  },
  activePattern: 'Rectangle',
  activeRule: {
    birth: null,
    survival: null,
    stateCount: null,
    range: null,
    neighborhoodType: null,
    includeCenter: null
  }
}