uniform sampler2D previousIterationTexture;

varying vec2 v_uvs[9];

void main() {
  vec4 centerTexel = texture2D(previousIterationTexture, v_uvs[0]);
  gl_FragColor = centerTexel;
}