import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Set up the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a geodesic sphere with higher detail (subdivision level = 1)
var geometry = new THREE.IcosahedronGeometry(12, 1); // Increase the subdivision level
var material = new THREE.MeshBasicMaterial({
  map: null, // No texture initially
  wireframe: false,
});
var sphere = new THREE.Mesh(geometry, material);

// Add the sphere to the scene
scene.add(sphere);

// Set the camera position
camera.position.z = 15;

// Create OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Create gradient texture
const gradientTexture = new THREE.CanvasTexture(
  createGradientCanvas(),
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  function () {
    // This function will be called once the texture is loaded
    material.map = gradientTexture; // Set the loaded texture to the material map
    render(); // Start rendering after the texture is loaded
  }
);

gradientTexture.wrapS = THREE.RepeatWrapping;
gradientTexture.wrapT = THREE.RepeatWrapping;
gradientTexture.repeat.set(1, 1);

function createGradientCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1;
  const context = canvas.getContext("2d");

  // Create gradient
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "blue");
  gradient.addColorStop(1, "red");

  // Fill with gradient
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}

// Render the scene
function render() {
  // Create an animation loop
  var animate = function () {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();

    // Rotate the sphere
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
  };

  // Start the animation loop
  animate();
}

// Uncomment the line below to start rendering immediately (if you don't want to wait for the texture to load)
// render();
