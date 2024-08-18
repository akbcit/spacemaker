import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { animateScene, cleanUp, handleResize, initializeScene } from '../utils/sceneUtils/initializeScene';
import Galaxy from "../types/Galaxy";
import Planet from "../types/Planet";

interface SpaceSceneProps {
  width: string | number;
  height: string | number;
  starCount?: number; // number of stars to create
  starSize?: number; // size of the stars
  starSpread?: number; // spread distance for stars
  minZoomDistance?: number; // minimum distance for zoom
  maxZoomDistance?: number; // maximum distance for zoom
  starColor?: number; // color of the stars
  starOpacity?: number; // opacity of the stars
}

const defaultConfig = {
  starCount: 100000,
  starSize: 0.1,
  starSpread: 2000,
  minZoomDistance: 10,
  maxZoomDistance: 500000000,
  starColor: 0xffffff,
  starOpacity: 0.8,
};

const SpaceScene: React.FC<SpaceSceneProps> = ({
  width,
  height,
  starCount = defaultConfig.starCount,
  starSize = defaultConfig.starSize,
  starSpread = defaultConfig.starSpread,
  minZoomDistance = defaultConfig.minZoomDistance,
  maxZoomDistance = defaultConfig.maxZoomDistance,
  starColor = defaultConfig.starColor,
  starOpacity = defaultConfig.starOpacity,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const widthValue = typeof width === 'number' ? width : mount.clientWidth;
    const heightValue = typeof height === 'number' ? height : mount.clientHeight;

    // Initialize the scene using the utility function
    const sceneSetup = initializeScene(mount, {
      width: widthValue,
      height: heightValue,
      minZoomDistance,
      maxZoomDistance,
    });

    const { scene, camera, renderer, controls } = sceneSetup;

    // Disable pan for OrbitControls
    controls.enablePan = true;

    // Add the Galaxy (stars) to the scene
    const galaxy = new Galaxy(starSize, starOpacity, starSpread, starCount, []); // Empty array for texture paths
    const starPoints = new THREE.Points(galaxy.geometry, galaxy.material);
    scene.add(starPoints);

    // Define the textures for Neptune (or any other planet)
    const planetTextures = {
      surfaceTexture: '../assets/neptunemap.jpg',
    };

    // Add a directional light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Add a Planet to the center of the scene using the updated Planet class
    const planet = new Planet(20, 32, 32, planetTextures, 0.01, 0x0077ff, 0.1, 0.9);
    planet.mesh.position.set(0, 0, 0); // Position the planet at the origin (center)
    scene.add(planet.mesh);

    // Position the camera so it looks at the origin
    camera.position.set(0, 0, 200); // Move the camera back along the z-axis
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Ensure the camera is looking at the center

    // Set up the animation loop using the utility function
    animateScene(sceneSetup);

    // Set up the resize handler
    const resizeHandler = () => handleResize(mount, camera, renderer);
    window.addEventListener('resize', resizeHandler);

    return () => {
      cleanUp(mount, renderer);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [width, height, starCount, starSize, starSpread, minZoomDistance, maxZoomDistance, starColor, starOpacity]);

  return <div ref={mountRef} style={{ width, height, border: '2px solid #000' }} />;
};

export default SpaceScene;
