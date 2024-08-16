import * as THREE from "three";

export function createRenderer(width: number, height: number): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    return renderer;
}