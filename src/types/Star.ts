import * as THREE from "three";

class Star {
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;

  constructor(
    public color: number = 0xffffff,
    public size: number = 0.1,
    public opacity: number = 0.8,
    public spread: number = 2000,
    public count: number = 10000,
    public texturePaths: string[] = [] // Array of texture paths
  ) {
    this.geometry = this.createGeometry();
    this.material = this.createMaterial();
  }

  // Method to create the geometry
  createGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < this.count; i++) {
      const x = THREE.MathUtils.randFloatSpread(this.spread);
      const y = THREE.MathUtils.randFloatSpread(this.spread);
      const z = THREE.MathUtils.randFloatSpread(this.spread);
      vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }

  // Method to create the material with randomization
  createMaterial(): THREE.PointsMaterial {
    const materialOptions: THREE.PointsMaterialParameters = {
      color: this.getRandomColor(),
      size: this.getRandomSize(),
      sizeAttenuation: true,
      transparent: true,
      opacity: this.opacity,
    };

    // If textures are provided, randomly select one
    if (this.texturePaths.length > 0) {
      const textureLoader = new THREE.TextureLoader();
      const randomTexture = textureLoader.load(this.getRandomTexture());
      materialOptions.map = randomTexture;
    }

    return new THREE.PointsMaterial(materialOptions);
  }

  // Method to get a random color
  getRandomColor(): number {
    return new THREE.Color(Math.random(), Math.random(), Math.random()).getHex();
  }

  // Method to get a random size
  getRandomSize(): number {
    return THREE.MathUtils.randFloat(this.size * 0.5, this.size * 2);
  }

  // Method to get a random texture path
  getRandomTexture(): string {
    const randomIndex = Math.floor(Math.random() * this.texturePaths.length);
    return this.texturePaths[randomIndex];
  }
}

export default Star;
