import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const numParticles = 700;

let container, stats;
let camera, scene, renderer;

let particles, time = 0;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let radius = new Array(numParticles);
let composer

const params = {
    threshold: 1,
    strength: 1,
    radius: 0.5,
    exposure: 1
};

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();

    //


    const positions = new Float32Array( numParticles * 3 );
    const scales = new Float32Array( numParticles );

    let i = 0, j = 0;
    let cnt = 0;
    for ( let i = 0; i < numParticles; i++ ) {
        let cur = i * 3;
        // positions[ cur   ] = 20 * Math.cos(i);
        positions[ cur   ] = 0;
        positions[ cur + 1 ] = -(i / numParticles) * 160 + 80 + Math.random() * 10 - 5;
        positions[ cur + 2 ] = 0;

        cnt += 0.1;
    }
    for ( let i = 0; i< numParticles; i++){
        scales[i] = Math.random()*2 + 0.3;
    }
    for ( let i = 0; i < numParticles; i++){
        radius[i] = 70 + Math.random() * 10 - 5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

  

    const material = new THREE.ShaderMaterial( {

        uniforms: {
            color: { value: new THREE.Color( 1.0, 1.0, 5.0 ) },
        },
        vertexShader: document.getElementById( 'waveVS' ).textContent,
        fragmentShader: document.getElementById( 'waveFS' ).textContent

    } );
    // material.blending = THREE.AdditiveBlending; // 지금 블랜딩 필요 없을 듯?
    // material.alphaTest = 0.5;

    //

    particles = new THREE.Points( geometry, material );
    scene.add( particles );

    {
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 0, 0);
        cube.scale.set(5, 5, 5);
        scene.add(cube);
    }

    //

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
    container.addEventListener( 'pointermove', onPointerMove );

    //

    window.addEventListener( 'resize', onWindowResize );

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
    composer.render();
}

function render() {

    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );

    const positions = particles.geometry.attributes.position.array;
    const scales = particles.geometry.attributes.scale.array;


    for ( let i = 0; i < numParticles; i++ ) {
        let cur = i * 3;
        let nx = positions[ cur     ] ;
        let ny = positions[ cur + 1 ];
        let nz = positions[ cur + 2 ];

        let noise = Math.random() * 0.2 - 0.1;
        radius[i] += noise;

        nx = radius[i] * Math.cos(i * 0.8 + time);
        ny += 0.5 + noise;
        nz = radius[i] * Math.sin(i * 0.8 + time);

        if (ny > 80){
            ny = -80;
        }

        positions[ cur   ] = nx;
        positions[ cur + 1 ] = ny;
        positions[ cur + 2 ] = nz;

    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;

    // renderer.render( scene, camera );

    time += 0.005;

}

function readShader(path){
    try{
        const text = fetch(path).then((res) => res.text())
        console.log(text);
        return text;
    } catch(err) {
        console.log(err);
    };
}


// bloom selective는 메테리얼을 껏다 켯다 하면서 구현하고 있음
// learn opegnl이랑 비교해서 구현이 어떻게 다른지 확인