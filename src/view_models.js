import '../style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { load_model } from './load_model';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Line } from 'three';

// Create mandatory variables
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;
camera.position.y = 2;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('app').appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.screenSpacePanning = false
controls.minDistance = 5;
controls.maxDistance = 3;
controls.maxPolarAngle = Math.PI;

// Current model displayed
let current_model = new THREE.Object3D();
let wireframe = new THREE.WireframeGeometry();
let line = new THREE.LineSegments();

// Create gui
let gui = new dat.GUI({
  height : 7 * 32 - 1
});

let params = {
  Scale: 1,
  GridHelper: true,
  Light: true,
};
let recenter = { Recenter:function(){
  camera.position.z = 7;
  camera.position.y = 4;
  camera.position.x = 0;
  camera.rotation.x = 0;
  camera.rotation.y = 0;
  camera.rotation.z = 0;
  camera.up = new THREE.Vector3(0,1,0);
}};
let ShowWireframe = { "Show wireframe":function() {
  if (wireframe)
    scene.remove(line);
  else {
    wireframe = new THREE.WireframeGeometry(current_model.children[0].geometry);
    line = new THREE.LineSegments(wireframe);
    line.material.color.setHex(0xff6347);
    scene.add(line);
  }
}};
gui.add(recenter,'Recenter');
gui.add(ShowWireframe, 'Show wireframe');

gui.add(params, 'Scale', 1, 5).onChange(function(value){
  current_model.scale.set(value, value, value);
});
gui.add(params, 'GridHelper').onChange(function(value){
  if (value) {
    scene.add(gridHelper);
  } else {
    scene.remove(gridHelper);
  }
});
gui.add(params, 'Light').onChange(function(value){
  if (value) {
    scene.add(ambientLight);
  } else {
    scene.remove(ambientLight);
  }
});

// Model loader menu
let models = {
    currentModel: "undefined",
}
gui.add(models, 'currentModel', {"Bonewheel Shield": '../assets/models/Bonewheel Shield/Bonewheel Shield.'}).onChange(function(value){
  load_model(value, scene, current_model);
});

// Add grid helper to scene
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

// Add lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Add skybox texture
scene.background = new THREE.Color('skyblue');

// Listen for events
document.addEventListener( 'mousewheel', (event) => {
  let fovMAX = 160;
  let fovMIN = 1;

  camera.fov -= event.wheelDeltaY * 0.05;
  camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
  camera.updateProjectionMatrix();
});

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
};

// Render loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();
}

render();