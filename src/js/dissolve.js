import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const params = {
    threshold: 1,
    strength: 0.25,
    radius: 0.5,
    exposure: 1,

    split : 0.5
};


let container, controls, stats;
let camera, scene, renderer;
let composer
const Clock = new THREE.Clock();

let time = 0;

let bloomPass;


let cube2;
init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 5;

    scene = new THREE.Scene();

    
    const texture = new THREE.TextureLoader().load( "../textures/noise_texture_0.png" );
    // cat1
    let cube1;
    {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial( {color : 0x00ffff, map : texture} ); 
        cube1 = new THREE.Mesh( geometry, material );
        cube1.position.set(1, 0, 0);
        scene.add( cube1);
    }

    // cat2
    {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.ShaderMaterial( {

            uniforms: {
                color: { value: new THREE.Color( 1.0, 0.0, 0.0 ) },
                noise: { value : texture },
                split: { value: params.split },
                glowSize: { value: 0.1},
            },
            vertexShader: document.getElementById( 'dissolveVS' ).textContent,
            fragmentShader: document.getElementById( 'dissolveFS' ).textContent,

        } );

        cube2 = new THREE.Mesh( geometry, material );
        cube2.position.set(-1, 0, 0);
        scene.add( cube2 );
    }
    /*
        box greometry에서 position, uv, normal 값을 attribute로 설정하는 장면을 포착!
        https://github.com/mrdoob/three.js/blob/master/src/geometries/BoxGeometry.js 에서 line : 53 ~ 56 확인
        vertex shader 에서 out 으로 fragment shader에 in 전달하면 texCoordinate 사용 가능
    */


    // -------------------------------------------------------
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild( renderer.domElement );

    const renderScene = new RenderPass( scene, camera );

    bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ));//, 1.5, 0.4, 0.85 );
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

    // gui
    const gui = new GUI();

    gui.add( params, 'threshold', 0, 1 );
    gui.add( params, 'strength', 0, 1 );
    gui.add( params, 'radius', 0, 1 );
    gui.add( params, 'exposure', 0, 1 );
    gui.add( params, 'split', 0, 1 );
    gui.open();


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

    particleUpdate(term, dt);
    guiUpdate();

    time += dt;
}

function particleUpdate(term, dt)
{
    // console.log(cube2.material.color);
}

function guiUpdate()
{
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;
    bloomPass.exposure = params.exposure;

    cube2.material.uniforms.split.value = Math.sin(time) * 0.5 + 0.5;
    console.log('split : ', params.split);
    console.log('material : ', cube2.material.uniforms.split);
    cube2.material.needsUpdate = true;
}
