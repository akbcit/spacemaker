import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
/**
 * Options for initializing a Three.js scene.
 */
interface SceneOptions {
  /** Width of the renderer. Defaults to mount element's clientWidth if not specified. */
  width?: number;
  /** Height of the renderer. Defaults to mount element's clientHeight if not specified. */
  height?: number;
  /** Type of camera to use. 'perspective' or 'orthographic'. Defaults to 'perspective'. */
  cameraType?: 'perspective' | 'orthographic';
  /** Field of view for perspective camera. Ignored for orthographic camera. Default is 75. */
  fov?: number;
  /** Aspect ratio for the camera. Default is width / height. */
  aspect?: number;
  /** Near clipping plane. Default is 0.1. */
  near?: number;
  /** Far clipping plane. Default is 1000. */
  far?: number;
  /** Initial camera position. Default is (0, 0, 5). */
  position?: THREE.Vector3;
  /** Point for the camera to look at. Default is (0, 0, 0). */
  lookAt?: THREE.Vector3;
  /** Minimum zoom distance for OrbitControls. Default is 1. */
  minZoomDistance?: number;
  /** Maximum zoom distance for OrbitControls. Default is 1000. */
  maxZoomDistance?: number;
  /** Additional options for WebGLRenderer. Default is { antialias: true }. */
  rendererOptions?: THREE.WebGLRendererParameters;
}

/**
 * Structure containing all necessary components of a Three.js scene setup.
 */
interface SceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
}

/**
 * Initializes a Three.js scene with customizable options.
 * 
 * @param mount - The HTML element to mount the renderer on.
 * @param options - Configuration options for the scene.
 * @returns An object containing the initialized scene, camera, renderer, and controls.
 */
export const initializeScene = (
  mount: HTMLElement,
  options: SceneOptions = {}
): SceneSetup => {
  // Destructure options with default values
  const {
    width = mount.clientWidth,
    height = mount.clientHeight,
    cameraType = 'perspective',
    fov = 75,
    aspect = width / height,
    near = 0.1,
    far = 1000,
    position = new THREE.Vector3(0, 0, 5),
    lookAt = new THREE.Vector3(0, 0, 0),
    minZoomDistance = 1,
    maxZoomDistance = 1000,
    rendererOptions = { antialias: true }
  } = options;

  // Create the scene
  const scene = new THREE.Scene();

  // Create and configure the camera based on the specified type
  let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  if (cameraType === 'perspective') {
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  } else {
    camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, near, far);
  }
  camera.position.copy(position);
  camera.lookAt(lookAt);

  // Create and configure the renderer
  const renderer = new THREE.WebGLRenderer(rendererOptions);
  renderer.setSize(width, height);
  mount.appendChild(renderer.domElement);

  // Set up OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = minZoomDistance;
  controls.maxDistance = maxZoomDistance;

  return { scene, camera, renderer, controls };
};

/**
 * Sets up the animation loop for the scene.
 * 
 * @param sceneSetup - The scene setup object returned by initializeScene.
 * @param customUpdate - Optional function for custom updates on each frame.
 */
export const animateScene = (sceneSetup: SceneSetup, customUpdate?: () => void): void => {
  const { scene, camera, renderer, controls } = sceneSetup;
  const animate = () => {
    requestAnimationFrame(animate);
    if (customUpdate) customUpdate();
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
};

/**
 * Handles resizing of the scene when the window or container size changes.
 * 
 * @param mount - The HTML element the renderer is mounted on.
 * @param camera - The camera used in the scene.
 * @param renderer - The WebGL renderer.
 */
export const handleResize = (
  mount: HTMLElement,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer
): void => {
  const newWidth = mount.clientWidth;
  const newHeight = mount.clientHeight;

  // Update camera parameters based on its type
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = newWidth / newHeight;
  } else if (camera instanceof THREE.OrthographicCamera) {
    camera.left = -newWidth / 2;
    camera.right = newWidth / 2;
    camera.top = newHeight / 2;
    camera.bottom = -newHeight / 2;
  }
  camera.updateProjectionMatrix();

  // Resize the renderer
  renderer.setSize(newWidth, newHeight);
};

/**
 * Cleans up the Three.js scene by removing the renderer and disposing of it.
 * 
 * @param mount - The HTML element the renderer is mounted on.
 * @param renderer - The WebGL renderer to be disposed.
 */
export const cleanUp = (mount: HTMLElement, renderer: THREE.WebGLRenderer): void => {
  mount.removeChild(renderer.domElement);
  renderer.dispose();
};