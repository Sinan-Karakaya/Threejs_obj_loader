import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

export function load_model(filename, scene, current_model)
{
    const mtlLoader = new MTLLoader();

    mtlLoader.load(
        filename + 'mtl',
        (materials) => {
            materials.preload();

            const objLoader = new OBJLoader()
            objLoader.setMaterials(materials);
            objLoader.load(
                filename + 'obj',
                (object) => {
                    scene.add(object);
                    current_model = object;
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                },
                (error) => {
                    alert("Could not load model");
                }
            )
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            alert("Could not load material");
        }
    )
}
