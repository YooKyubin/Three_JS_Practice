import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';


const numParticles = 700;

let container, stats;
let camera, scene, renderer;

let particles, time = 0;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let radius = new Array(numParticles);

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
        positions[ cur + 1 ] = -(i / numParticles) * 160 + 80 + Math.random() * 5 - 2.5;
        positions[ cur + 2 ] = 0;

        cnt += 0.1;
    }
    for ( let i = 0; i< numParticles; i++){
        scales[i] = 10 + Math.random() * 4 - 2;
    }
    for ( let i = 0; i < numParticles; i++){
        radius[i] = 70 + Math.random() * 5 - 2.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

    // const vs = readShader("../shaders/wave.vs")
    // const fs = readShader("../shaders/wave.fs")


    const material = new THREE.ShaderMaterial( {

        uniforms: {
            color: { value: new THREE.Color( 0xfeefdf ) },
        },
        vertexShader: document.getElementById( 'waveVS' ).textContent,
        fragmentShader: document.getElementById( 'waveFS' ).textContent

    } );
    material.blending = THREE.AdditiveBlending;
    // material.alphaTest = 0.5;

    //

    particles = new THREE.Points( geometry, material );
    scene.add( particles );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

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

}

function render() {

    // camera.position.x += ( mouseX - camera.position.x ) * .05;
    // camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );

    const positions = particles.geometry.attributes.position.array;
    const scales = particles.geometry.attributes.scale.array;

    let i = 0, j = 0;

    // 위 아래 움직임 cpu로 계산
    // for ( let ix = 0; ix < AMOUNTX; ix ++ ) {

    //     for ( let iy = 0; iy < AMOUNTY; iy ++ ) {

    //         // positions[ i + 1 ] = ( Math.sin( ( ix + time ) * 0.3 ) * 50 ) +
    //         //                 ( Math.sin( ( iy + time ) * 0.5 ) * 50 );

    //         positions[   i   ]
    //         positions[ i + 1 ]
    //         positions[ i + 2 ]

    //         scales[ j ] = ( Math.sin( ( ix + time ) * 0.3 ) + 1 ) * 20 +
    //                         ( Math.sin( ( iy + time ) * 0.5 ) + 1 ) * 20;

    //         i += 3;
    //         j ++;

    //     }

    // }
    
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

    renderer.render( scene, camera );

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