import * as THREE from "three";

interface PlanetTextures {
  surfaceTexture: string;    // Path to the planet's surface texture map
  bumpMap?: string;          // Path to the planet's bump map (optional)
  metalnessMap?: string;     // Path to the metalness map (optional)
  roughnessMap?: string;     // Path to the roughness map (optional)
}

class Planet {
  geometry: THREE.SphereGeometry;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.Mesh;

  constructor(
    public radius: number = 50,
    public widthSegments: number = 32,
    public heightSegments: number = 32,
    public textures: PlanetTextures,
    public bumpScale: number = 0.05,  // Default bump scale for relief
    public color: number = 0xffffff,  // Default color (white)
    public metalness: number = 0.1,   // Default metalness
    public roughness: number = 1      // Default roughness
  ) {
    this.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    this.material = this.createMaterial(textures, bumpScale, color, metalness, roughness);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  // Method to create the material with optional textures and properties
  createMaterial(
    textures: PlanetTextures,
    bumpScale: number,
    color: number,
    metalness: number,
    roughness: number
  ): THREE.MeshStandardMaterial {
    const textureLoader = new THREE.TextureLoader();

    const materialOptions: THREE.MeshStandardMaterialParameters = {
      color,
      metalness,
      roughness,
      map: textureLoader.load(textures.surfaceTexture), // Load the surface texture map
    };

    if (textures.bumpMap) {
      materialOptions.bumpMap = textureLoader.load(textures.bumpMap); // Load the bump map
      materialOptions.bumpScale = bumpScale; // Apply bump scale
    }

    if (textures.metalnessMap) {
      materialOptions.metalnessMap = textureLoader.load(textures.metalnessMap); // Load the metalness map
    }

    if (textures.roughnessMap) {
      materialOptions.roughnessMap = textureLoader.load(textures.roughnessMap); // Load the roughness map
    }

    return new THREE.MeshStandardMaterial(materialOptions);
  }
}

export default Planet;
