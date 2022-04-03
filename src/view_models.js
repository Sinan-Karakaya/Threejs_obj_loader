import '../style.css';
import * as THREE from 'three';

// Create mandatory variables
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app').appendChild( renderer.domElement );

// Add grid helper to scene
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

// Create basic geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 7;
camera.position.y = 4;
camera.lookAt(0, 0, 0);

// Render loop
function render() {
  requestAnimationFrame(render);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

render();