import * as THREE from "three";

export function positionToColor(): THREE.Color {
  // Generate random values for red, green, and blue
  let r = Math.random();
  let g = Math.random();
  let b = Math.random();

  // Increase variety by emphasizing different channels
  // Randomly emphasize one of the color channels more
  const emphasis = Math.random();
  if (emphasis < 0.33) {
    r = Math.max(r, Math.random());
  } else if (emphasis < 0.66) {
    g = Math.max(g, Math.random());
  } else {
    b = Math.max(b, Math.random());
  }

  // Adjust brightness by scaling all colors by a random factor
  const brightness = 0.7 + Math.random() * 0.3; // Brightness range from 0.7 to 1.0
  r *= brightness;
  g *= brightness;
  b *= brightness;

  return new THREE.Color(r, g, b);
}
