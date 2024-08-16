import * as THREE from 'three';

export function addObjects(
  scene: THREE.Scene,
  createGeometry: () => THREE.BufferGeometry,
  createMaterial: (color: THREE.Color) => THREE.Material,
  count: number = 200,
  positionSpread: number = 100,
  isPoints: boolean = false,
  createColorFromPosition?: (x: number, y: number, z: number) => THREE.Color // Function to create color based on position
): void {
  if (isPoints) {
    const geometry = createGeometry();

    // If createColorFromPosition is provided, create a color attribute for the points
    if (createColorFromPosition) {
      const colors = [];
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        const color = createColorFromPosition(x, y, z);
        colors.push(color.r, color.g, color.b);
      }
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    }

    const material = createMaterial(new THREE.Color(0xffffff));
    if (createColorFromPosition) {
      material.vertexColors = true;
    }

    const points = new THREE.Points(geometry, material);
    scene.add(points);
  } else {
    for (let i = 0; i < count; i++) {
      const geometry = createGeometry();
      const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(positionSpread));

      const color = createColorFromPosition ? createColorFromPosition(x, y, z) : new THREE.Color(0xffffff);
      const material = createMaterial(color);
      const object = new THREE.Mesh(geometry, material);

      object.position.set(x, y, z);
      scene.add(object);
    }
  }
}
