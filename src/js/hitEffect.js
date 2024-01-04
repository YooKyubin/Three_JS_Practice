import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const params = {
    threshold: 1,
    strength: 1,
    radius: 0.5,
    exposure: 1
};

const numParticles = 20;

let container, controls, stats;
let camera, scene, renderer;

let particles, time = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let explosionLoc;
let initVelocity = [];

let composer

const identity = new THREE.Vector3(1.0);
let luminance = new THREE.Color( 50.0, 50.0, 50.0 );

let hitPosition;
const Clock = new THREE.Clock();
let duration = 2;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 10;

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

    scene.add(hitPosition);
    hitPosition.position.set(
        cube.position.x + Math.random() * 0.2 - 0.1, 
        cube.position.y + Math.random() * 0.2 - 0.1, 
        cube.position.z + Math.random() * 0.2 - 0.1
        );

    /*
    순서 중요! particle -> center 순서로 그리기
    particle, center 둘 다 depth test를 하지 않아서 
    center 를 먼저 그리면 particle에 의해 가려지게 되어
    bloom 효과가 없어짐
    
    꼭 순서 안지켜도 할 수 있는 방법이 있을텐데..
    */
   // particle
   {
        const vertices = [];
        for (let i=0; i<numParticles; ++i)
        {
            const x = Math.random() * 0.2 - 0.1;
            const y = Math.random() * 0.2 - 0.1;
            const z = Math.random() * 0.2 - 0.1;

            vertices.push(x, y, z);
            let temp = new THREE.Vector3(x, y, z);
            console.log('temp : ' , temp);
            console.log('normalize : ' , temp.normalize());
            initVelocity.push(temp);
            console.log(initVelocity[i]);
            console.log(initVelocity[i].x);
            console.log(initVelocity[i].y);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial( { color: new THREE.Color(1.0, 1.0, 1.0) } );
        material.size = 0.1;
        material.depthTest = false;
        let hitCenter = new THREE.Points( geometry, material );
        hitCenter.name = 'particle';
        hitPosition.add( hitCenter );
    }
   // center
    {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
        const material = new THREE.PointsMaterial( { color: luminance } );
        material.size = 0.05;
        material.depthTest = false;
        let hitCenter = new THREE.Points( geometry, material );
        hitPosition.add( hitCenter );
    }



    

    
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
    
    // const positions = particles.geometry.attributes.position.array;
    
    // renderer.render( scene, camera );
    Update();
    composer.render();
    
}

function Update()
{
    const term = 0.5;
    const dt = Clock.getDelta();
    if (time >= duration + term || time < term)
    {
        // console.log(time);
        // console.log('delta time : ' + dt);
    }
    else
    {
        // 설정한 거리를 설정한 시간에 도달할 수 있도록 통제하는 코드를 만들어야 함
        let mytime = time - term;
        const speed = -(mytime - duration) * (mytime - duration) * (mytime - duration); // 세제곱 그래프
        // const speed = -(mytime - duration);
        const positions = hitPosition.getObjectByName('particle').geometry.attributes.position.array;
        for (let i=0; i<numParticles; ++i)
        {
            const displacement = new THREE.Vector3();
            let cur = new THREE.Vector3(positions[i*3], positions[i*3 + 1], positions[i*3 + 2]);
            displacement.copy(initVelocity[i]).multiplyScalar(speed * dt);
            console.log(displacement);

            // 속도가 너무 느림
            positions[ i*3   ] += displacement.x;
            positions[ i*3+1 ] += displacement.y;
            positions[ i*3+2 ] += displacement.z;
        }
    }
    // y = -x + duration;

    
    time += dt;
    hitPosition.getObjectByName('particle').geometry.attributes.position.needsUpdate = true;
        
}