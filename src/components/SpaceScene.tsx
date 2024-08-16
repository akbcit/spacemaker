// src/SpaceScene.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { createScene } from '../utils/createScene';
import { createCamera } from '../utils/createCamera';
import { createRenderer } from '../utils/createRenderer';
import { addObjects } from '../utils/addObjects';
import { positionToColor } from '../utils/positionToColor';

interface SpaceSceneProps {
  width: string | number;
  height: string | number;
}

const SpaceScene: React.FC<SpaceSceneProps> = ({ width, height }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const widthValue = typeof width === 'number' ? width : mount.clientWidth;
    const heightValue = typeof height === 'number' ? height : mount.clientHeight;

    // Create scene, camera, and renderer using utility functions
    const scene = createScene();
    const camera = createCamera(widthValue, heightValue);
    const renderer = createRenderer(widthValue, heightValue);
    mount.appendChild(renderer.domElement);

    // Add OrbitControls for zooming and rotating
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;  
    controls.minDistance = 10;
    controls.maxDistance = 500000000;

    // Create geometry for points (stars)
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    // Add stars to the scene using the addObjects utility function
    addObjects(
      scene,
      () => starGeometry, // Geometry for stars
      () => starMaterial, // Material for stars
      10000, // Number of stars
      2000, // Position spread for stars
      true, // Indicates that we are using Points,
      positionToColor
    );

    // Start the animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls on each frame
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [width, height]);

  return <div ref={mountRef} style={{ width, height }} />;
};

export default SpaceScene;
