import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
// import { tslFn, uniform, texture, instanceIndex, float, vec3, storage, SpriteNodeMaterial, If } from 'three/nodes';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const numParticles = 1000;

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

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 100;

    scene = new THREE.Scene();


    const positions = new Float32Array( numParticles * 3 );
    velocity = new Float32Array( numParticles * 3 );

    // random line generate
    let origin = {x:0, y:10, z:0};
    let t1 = {x:0, y:0, z:0};
    

    t1.x = origin.x + Math.random() * 10 - 5;
    t1.y = origin.y + Math.random() * 10 - 5;
    t1.z = origin.z + Math.random() * 10 - 5;
    
    console.log(origin);
    console.log(t1);

    let cnt = 0;
    for ( let i = 0; i < numParticles; i++ ) {
        let step = (i / numParticles);
        let cur = i * 3;
        positions[ cur     ] = origin.x + step * (t1.x - origin.x);
        positions[ cur + 1 ] = origin.y + step * (t1.y - origin.y);
        positions[ cur + 2 ] = origin.z + step * (t1.z - origin.z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    const material = new THREE.PointsMaterial( { color: 0xff0000, sizeAttenuation: true } );

    //

    particles = new THREE.Points( geometry, material );
    scene.add( particles );

    // cal random explostion location
    let half = {x: (origin.x + t1.x) / 2 , y: (origin.y + t1.y) / 2, z: (origin.z + t1.z) / 2};
    console.log(half);
    let perpendicular = generateRandomPerpendicularVector(half);
    explosionLoc = {
        x: half.x + perpendicular.x, 
        y: half.y + perpendicular.y * (perpendicular.y > 0 ? -1 : 1), // 항상 아래쪽에서 폭발핟도록 (연출))
        z: half.z + perpendicular.z
    };
    console.log("explotsionLoc : ", explosionLoc);
    
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(explosionLoc.x, explosionLoc.y, explosionLoc.z);
    scene.add(cube);

    for (let i=0; i<numParticles; ++i)
    {
        let cur = i * 3;
        let noise = Math.random() * 3 + 0;
    
        let initVec = {
            x: positions[ cur     ] - explosionLoc.x + noise,
            y: positions[ cur + 1 ] - explosionLoc.y + noise,
            z: positions[ cur + 2 ] - explosionLoc.z + noise
        };
        let size = getLength(initVec);

        velocity[ cur     ] = initVec.x / size * 2;
        velocity[ cur + 1 ] = initVec.y / size * 2;
        velocity[ cur + 2 ] = initVec.z / size * 2;
    }


    // plane
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial( {color: 0x5f5f5f, side: THREE.DoubleSide} );
    planeMaterial.blending = THREE.AdditiveBlending;
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // xz 평면에 위치시킴
    plane.position.set(0, -10, 0);
    scene.add(plane);


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

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
    
    const gravity = -0.098;
    const positions = particles.geometry.attributes.position.array;
    
    for ( let i = 0; i < numParticles; i++ ) {
        let cur = i * 3;

        if (positions[ cur + 1 ] < -10 + 1)
            continue;

        velocity[ cur     ];
        velocity[ cur + 1 ] += gravity;
        velocity[ cur + 2 ];

        positions[ cur     ] += velocity[ cur     ] * 0.1;
        positions[ cur + 1 ] += velocity[ cur + 1 ] * 0.1;
        positions[ cur + 2 ] += velocity[ cur + 2 ] * 0.1;

    }

    particles.geometry.attributes.position.needsUpdate = true;

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

function getLength(given)
{
    return Math.sqrt(given.x**2 + given.y**2 + given.z**2);
}

function crossProduct(v1, v2) {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
    };
}

function generateRandomPerpendicularVector( givenVector )
{
    var randomVector = { x: Math.random(), y: Math.random(), z: Math.random() };
    
    // 주어진 벡터와 수직인 벡터를 찾기 위한 외적 계산
    var perpendicularVector = crossProduct(givenVector, randomVector);

    // 크기를 조절하여 길이가 length가 되도록
    let length = Math.random() * 1.0 + 0.1;
    var scaleFactor = length / getLength(perpendicularVector);
    perpendicularVector.x *= scaleFactor;
    perpendicularVector.y *= scaleFactor;
    perpendicularVector.z *= scaleFactor;

    return perpendicularVector;
}

// 지금 구현이 시간에 대한 적분없이 그냥 프레임단위로 해버려서 아주 곤란하다.
// 수정이 시급하지만 너무 졸리니까 여기까지만

// 그리고 각종 수치들에 대한 하드코딩들도 손봐야겠다.