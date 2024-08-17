import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { animateScene, cleanUp, handleResize, initializeScene } from '../utils/initializeScene';
import Star from "../types/Star";


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
  starCount: 10000,
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
    controls.enablePan = false;

    // Use the Star class
    const star = new Star(starColor, starSize, starOpacity, starSpread, starCount);

    // Add the star geometry and material to the scene
    const starPoints = new THREE.Points(star.geometry, star.material);
    scene.add(starPoints);

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