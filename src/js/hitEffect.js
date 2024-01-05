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


let container, controls, stats;
let camera, scene, renderer;
let composer
const Clock = new THREE.Clock();

let time = 0;

const numParticles = 20;
let particleStart = [];
let particleEnd = [];
let initVelocity = [];
let hitPosition;
let luminance = new THREE.Color( 30.0, 30.0, 30.0 );
let duration = 1;

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
            initVelocity.push(temp.clone().normalize());

            particleStart.push(temp); // 처음 위치
            particleEnd.push(temp.clone().normalize().multiplyScalar(3)); // 처음위치에서 방향그대로 길이 5 만큼 증가
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial( { color: new THREE.Color(1.0, 1.0, 1.0) } );
        material.size = 0.2;
        material.depthTest = false;
        let hitParticle = new THREE.Points( geometry, material );
        hitParticle.name = 'particle';
        hitPosition.add( hitParticle );
    }
    // center
    {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
        const material = new THREE.PointsMaterial( { color: luminance } );
        material.size = 0.1;
        material.depthTest = false;
        let hitCenter = new THREE.Points( geometry, material );
        hitCenter.name = 'center';
        hitPosition.add( hitCenter );
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

    particleUpdate(term, dt);
    centerUpdate(term, dt);

    time += dt;
}

function particleUpdate(term, dt)
{
    const particleObj = hitPosition.getObjectByName('particle');
    if (time >= duration + term || time < term)
    {
        particleObj.visible = false;
        // console.log(time);
        // console.log('delta time : ' + dt);
    }
    else
    {
        particleObj.visible = true;
        // 설정한 거리를 설정한 시간에 도달할 수 있도록 통제하는 코드를 만들어야 함 : lerp
        let timeElapse = time - term;
        let t = timeElapse / duration;
        // t = Math.sin(t * Math.PI * 1/2);
        t = -pow(t-1, 4) + 1; // (0, 0) , (1, 1)

        const positions = particleObj.geometry.attributes.position.array;
        for (let i=0; i<numParticles; ++i)
        {
            let cur = new THREE.Vector3(positions[i*3], positions[i*3 + 1], positions[i*3 + 2]);
            cur.lerpVectors(particleStart[i], particleEnd[i], t);
            
            positions[ i*3   ] = cur.x;
            positions[ i*3+1 ] = cur.y;
            positions[ i*3+2 ] = cur.z;
        }

        // particleObj.material.size = ;
    }
    
    hitPosition.getObjectByName('particle').geometry.attributes.position.needsUpdate = true;
}

function centerUpdate(term, dt)
{
    const CenterObj = hitPosition.getObjectByName('center');
    // console.log(CenterObj.material.color);
    if (time > term)
    {
        // hitPosition.getObjectByName('center').material.color = new THREE.Color(0x00ff00);
        CenterObj.visible = false;
    }
    // hitPosition.getObjectByName('center').material.color.addScalar(-1.0);

    // hitPosition.getObjectByName('center').material.needsUpdate = true; // 이거 필요없?음
}

function pow(val, exp)
{
    let ret = 1;
    for (let i=0; i<exp; ++i)
    {
        ret *= val;
    }
    return ret;
}