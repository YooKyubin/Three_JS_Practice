import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const numParticles = 100;

let container, controls, stats;
let camera, scene, renderer;

let particles, time = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let renderTarget;
let finalComposer, onlyBloomComposer; 

const params = {
    threshold: 0,
    strength: 1,
    radius: 0.5,
    exposure: 1
};

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 10;

    scene = new THREE.Scene();

    //multiple render target (2)
    // renderTarget = new THREE.WebGLMultipleRenderTargets(
    //     window.innerWidth * window.devicePixelRatio,
    //     window.innerHeight * window.devicePixelRatio,
    //     2
    // );

    // for ( let i = 0, il = renderTarget.texture.length; i < il; i ++ ) {

    //     renderTarget.texture[ i ].minFilter = THREE.NearestFilter;
    //     renderTarget.texture[ i ].magFilter = THREE.NearestFilter;

    // }

    // name
    // renderTarget.texture[ 0 ].name = 'general';
    // renderTarget.texture[ 1 ].name = 'bloom';

    // renderTarget = new THREE.WebGLMultipleRenderTargets(
    //     window.innerWidth * window.devicePixelRatio,
    //     window.innerHeight * window.devicePixelRatio,
    //     2
    // );

    // const bloomMaterial = new THREE.RawShaderMaterial( {
    //     name: 'bloom',
    //     vertexShader: document.querySelector( '#bloom-vert' ).textContent.trim(),
    //     fragmentShader: document.querySelector( '#bloom-frag' ).textContent.trim(),
    //     uniforms: {
    //         color: { value : new THREE.Vector3(2.0, 0.0, 0.8)}
    //     },
    //     glslVersion: THREE.GLSL3
    // })

    
    //cube
    { 
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial( {color: new THREE.Color( 2.0, 1.0, 1.0)} );
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(2, 0, 0);
        scene.add(cube);
    }
    {
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial( {color: new THREE.Color( 0.1, 0.1, 0.2)} );
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
    
    // render
    const renderScene = new RenderPass( scene, camera );

    // bloomComposer
    const over1Pass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                result: { value: null } // 기본 렌더타겟이 할당될것으로 기대
            },
            vertexShader: document.getElementById( 'discard-vert' ).textContent,
            fragmentShader: document.getElementById( 'discard-frag' ).textContent,
            defines: {} 
        } ), 'result'
    );
    over1Pass.needsSwap = true; // 이게 뭔지 모름

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ));//, 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    onlyBloomComposer = new EffectComposer( renderer );
    onlyBloomComposer.renderToScreen = false; // 스크린에 렌더링 안하는게되면 어디로 가는거지?
    onlyBloomComposer.addPass(renderScene);
    onlyBloomComposer.addPass(over1Pass);
    onlyBloomComposer.addPass(bloomPass);


    const mixPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: onlyBloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById( 'mixPass-vert' ).textContent,
            fragmentShader: document.getElementById( 'mixPass-frag' ).textContent,
            defines: {}
        } ), 'baseTexture'
    );
    mixPass.needsSwap = true; // 이것때문에 flicker 현상이 발생하고 있음

    const outputPass = new OutputPass();

    finalComposer = new EffectComposer( renderer );
    finalComposer.addPass( renderScene );
    finalComposer.addPass( mixPass );
    finalComposer.addPass( outputPass );


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
    
    // renderer.render( scene, camera );
    onlyBloomComposer.render();
    finalComposer.render();


}