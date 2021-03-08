varying vec2 v_uv;
uniform sampler2D textureToDisplay;
uniform sampler2D colors;

void main() {
  float state = texture2D(textureToDisplay, v_uv).r;

  gl_FragColor = texture2D(colors, vec2(state, 0));
}