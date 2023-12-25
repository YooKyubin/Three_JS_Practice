import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const numParticles = 100;

let container, controls, stats;
let camera, scene, renderer;

let particles, time = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let explosionLoc;
let velocity;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 10;

    scene = new THREE.Scene();

    renderTarget = new THREE.WebGLMultipleRenderTargets(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio,
        2
    );

    const bloomMaterial = new THREE.RawShaderMaterial( {
        name: 'G-Buffer Shader',
        vertexShader: document.querySelector( '#gbuffer-vert' ).textContent.trim(),
        fragmentShader: document.querySelector( '#gbuffer-frag' ).textContent.trim(),
        uniforms: {
            tDiffuse: { value: diffuse },
            repeat: { value: new THREE.Vector2( 5, 0.5 ) },
            color: { value : Vector3(0x00ffff)}
        },
        glslVersion: THREE.GLSL3
    })

    
    //cube
    {
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(2, 0, 0);
        scene.add(cube);
    }
    {
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-2, 0, 0);
        scene.add(cube);
    }

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    container.style.touchAction = 'none';

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

//

function onPointerMove( event ) {

    if ( event.isPrimary === false ) return;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    camera.lookAt( scene.position );
    
    renderer.render( scene, camera );


}