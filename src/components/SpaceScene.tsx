import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { createScene } from '../utils/createScene';
import { createCamera } from '../utils/createCamera';
import { createRenderer } from '../utils/createRenderer';
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

    const scene = createScene();
    const camera = createCamera(widthValue, heightValue);
    const renderer = createRenderer(widthValue, heightValue);

    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = minZoomDistance;
    controls.maxDistance = maxZoomDistance;

    // Use the Star class
    const star = new Star(starColor, starSize, starOpacity, starSpread, starCount);

    // Add the star geometry and material to the scene
    const starPoints = new THREE.Points(star.geometry, star.material);
    scene.add(starPoints);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height, starCount, starSize, starSpread, minZoomDistance, maxZoomDistance, starColor, starOpacity]);

  return <div ref={mountRef} style={{ width, height, border: '2px solid #000' }} />;
};

export default SpaceScene;
