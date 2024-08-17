import * as THREE from "three";


 class Star {

    geometry: THREE.BufferGeometry;
    material: THREE.PointsMaterial;
  
    constructor(
      public color: number = 0xffffff,
      public size: number = 0.1,
      public opacity: number = 0.8,
      public spread: number = 2000,
      public count: number = 10000
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
  
    // Method to create the material
    createMaterial(): THREE.PointsMaterial {
      return new THREE.PointsMaterial({
        color: this.color,
        size: this.size,
        sizeAttenuation: true,
        transparent: true,
        opacity: this.opacity,
      });
    }
  }

export default Star;
  