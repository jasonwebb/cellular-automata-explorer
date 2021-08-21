varying vec2 v_uv;
uniform sampler2D textureToDisplay;
uniform sampler2D colors;
uniform bool historyEnabled;

void main() {
  float state = texture2D(textureToDisplay, v_uv).r;
  vec4 outputColor = vec4(0,0,0,0);

  if(historyEnabled) {
    outputColor = mix(
                    texture2D(colors, vec2(0,0)),
                    texture2D(colors, vec2(1,0)),
                    state
                  );
  } else {
    outputColor = texture2D(colors, vec2(state, 0));
  }

  gl_FragColor = outputColor;
}