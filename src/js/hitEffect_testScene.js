import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { hitEffect } from './hitEffect.js';

const params = {
    threshold: 1,
    strength: 1,
    radius: 0.5,
    exposure: 1
};


let container, controls, stats;
let camera, scene, renderer;
let composer
const Clock = new THREE.Clock();

let time = 0;

const numParticles = 10;
let particleStart = [];
let particleEnd = [];
let initVelocity = [];
let particleInitSize = 0.5;
let hitPosition;
let luminance = new THREE.Color( 30.0, 30.0, 30.0 );
let duration = 1;

let effects = [];

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 20;

    scene = new THREE.Scene();

    hitPosition = new THREE.Object3D();
    // cat
    let cube;
    {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial( {color : 0x00ff00} ); 
        cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
    }

    
    hitPosition = new hitEffect(cube);
    scene.add(hitPosition.object);

    let yAcc = -5;
    for (let i=-10; i<10; i += 3)
    {
        for (let j=-10; j<10; j+=3)
        {
            let y = 1/2 * i + -1/2 * j;
            cube.position.set(i, y, j);
            let temp = new hitEffect(cube);
            effects.push(temp);
            scene.add(temp.object);
            yAcc += 0.5
        }
    }

    

    // -------------------------------------------------------
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild( renderer.domElement );

    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ));//, 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const outputPass = new OutputPass();

    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    composer.addPass( outputPass );
    
    stats = new Stats();
    container.appendChild( stats.dom );

    container.style.touchAction = 'none';
    // container.addEventListener( 'pointermove', onPointerMove );

    //

    window.addEventListener( 'resize', onWindowResize );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 5;
	controls.maxDistance = 70;
	controls.target.set( 0, - 1, 0 );
	controls.update();

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    camera.lookAt( scene.position );

    
    Update();
    // renderer.render( scene, camera );
    composer.render();
    
}

function Update()
{
    const term = 0.1;
    const dt = Clock.getDelta();

    hitPosition.Update(dt);
    for (let i =0; i<effects.length; ++i)
    {
        effects[i].Update(dt);
    }

    time += dt;
}