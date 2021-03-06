varying vec2 v_uv;
uniform sampler2D textureToDisplay;

void main() {
  float state = texture2D(textureToDisplay, v_uv).r;
  gl_FragColor = vec4(state, state, state, 1.);
}