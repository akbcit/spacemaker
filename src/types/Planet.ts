import * as THREE from "three";

class Planet {
    geometry: THREE.SphereGeometry;
    material: THREE.MeshBasicMaterial;
    mesh: THREE.Mesh;
  
    constructor(
      public radius: number = 100, // Radius of the planet
      public color: number = 0x00ff00, // Color of the planet (green for example)
      public detail: number = 32 // Level of detail for the sphere (number of segments)
    ) {
      this.geometry = this.createGeometry();
      this.material = this.createMaterial();
      this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
  
    // Method to create the geometry
    createGeometry(): THREE.SphereGeometry {
      return new THREE.SphereGeometry(this.radius, this.detail, this.detail);
    }
  
    // Method to create the material
    createMaterial(): THREE.MeshBasicMaterial {
      return new THREE.MeshBasicMaterial({ color: this.color });
    }
  }

  export default Planet;
  