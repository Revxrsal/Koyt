export function uid() {
  return crypto.getRandomValues(new Int32Array(1))[0];
}
