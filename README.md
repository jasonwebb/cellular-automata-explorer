## What is cellular automata?

```
TODO
```

## How does this project work?

```
TODO
```

## Technical notes

### Setting up and running locally.

1. Run `npm install` to get all packages.
1. Run `npm run serve` to start up the Webpack server and launch the app ina  live-reloading browser window.

### Technologies used

* [ThreeJS](https://threejs.org/) for WebGL conveniences like running custom shaders and managing uniforms.
* [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)) shaders for running the reaction-diffusion equation for every pixel of the screen and rendering.
* Vanilla ES6 JavaScript.
* [@kchapelier](https://github.com/kchapelier)'s [cellular-automata-rule-parser](https://github.com/kchapelier/cellular-automata-rule-parser) to convert human-friendly rule definition strings into normalized parametric objects that make driving the simulation simpler.
* [Webpack](https://webpack.js.org/) build system with live-reloading dev server.
* [Github Pages](https://pages.github.com/) to serve the files.

## Supported rule formats

For now, see @kchapelier's [cellular-automata-rule-parser](https://github.com/kchapelier/cellular-automata-rule-parser).