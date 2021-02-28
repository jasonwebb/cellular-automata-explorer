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
    }
  },
  scale: {
    min: .01,
    max: 5,
    value: 1
  },
  patterns: {
    circle: {
      radius: {
        min: 0.1,
        max: 5,
        value: 100
      }
    }
  }
}