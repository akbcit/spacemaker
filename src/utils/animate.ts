import * as THREE from 'three';

export function animate(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
    const animationLoop = () => {
      requestAnimationFrame(animationLoop);
      renderer.render(scene, camera);
    };
    animationLoop();
  }