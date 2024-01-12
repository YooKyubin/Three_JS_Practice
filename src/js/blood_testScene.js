import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { blood } from './blood.js';
import { objectPool } from './objectPool.js';

const params = {
    threshold: 1,
    strength: 1,
    radius: 0.5,
    exposure: 1
};

let windowHalfX, windowHalfY

let container, controls, stats;
let camera, scene, renderer;
let composer
const Clock = new THREE.Clock();

let time = 0;

let hitObjectPool;

var raycaster, mouse;


init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 20;

    scene = new THREE.Scene();

    // 레이캐스터 및 마우스 초기화
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', onMouseDown, false);

    // cat
    let cube;
    {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial( {color : 0xffffff} ); 
        cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
    }



    hitObjectPool = new objectPool(new blood(), 20);

    for (let i=-10; i<10; i += 6)
    {
        for (let j=-10; j<10; j+=6)
        {
            let y = 1/4 * i + -1/2 * j + 2;
            let temp = hitObjectPool.GetObject(new THREE.Vector3(i, y, j));
            if (temp != null)
            {
                console.log('object : ', temp.object);
                scene.add( temp.object );
            }
            let tempcube = cube.clone();
            tempcube.position.set(i, y, j);
            scene.add( tempcube );
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

    hitObjectPool.Update(dt);

    time += dt;
}

function onMouseDown(event) {
    // chat GPT야 고마워~
    // 마우스 클릭 이벤트에서 정규화된 디바이스 좌표를 얻음
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 레이캐스터를 업데이트하고 광선을 생성
    raycaster.setFromCamera(mouse, camera);

    // 광선과의 교차점을 찾음
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // 첫 번째 교차점의 월드 좌표 출력
        console.log('클릭한 위치의 월드 좌표:', intersects[0].point);


        let temp = hitObjectPool.GetObject(intersects[0].point);
        if (temp != null)
        {
            console.log('object : ', temp.object);
            scene.add( temp.object );
        }

    }
}