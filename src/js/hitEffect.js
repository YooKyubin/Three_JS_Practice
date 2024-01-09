import * as THREE from 'three';

/*
    순서 중요! particle -> center 순서로 그리기
    particle, center 둘 다 depth test를 하지 않아서 
    center 를 먼저 그리면 particle에 의해 가려지게 되어
    bloom 효과가 없어짐
    
    꼭 순서 안지켜도 할 수 있는 방법이 있을텐데..
*/

const numParticles = 10;
class hitEffect
{
    object = new THREE.Object3D();
    duration = 1;
    targetPosition = new THREE.Vector3();

    particleStart = [];
    particleEnd = [];
    initVelocity = [];
    particleInitSize = 0.5;
    particleLength = 3;
    
    luminance = new THREE.Color( 30.0, 30.0, 30.0 );

    timeElapse = 0;

    constructor( target )
    {
        this.targetPosition = target.position;
        this.#init();
    }

    #init()
    {
        this.#particleInit();
        this.#centerInit();

        this.object.position.set(
            this.targetPosition.x + Math.random() * 0.2 - 0.1, 
            this.targetPosition.y + Math.random() * 0.2 - 0.1, 
            this.targetPosition.z + Math.random() * 0.2 - 0.1
        );
    }

    #particleInit()
    {
        const vertices = [];
        for (let i=0; i<numParticles; ++i)
        {
            const x = Math.random() * 0.2 - 0.1;
            const y = Math.random() * 0.2 - 0.1;
            const z = Math.random() * 0.2 - 0.1;

            vertices.push(x, y, z);
            let temp = new THREE.Vector3(x, y, z);
            this.initVelocity.push(temp.clone().normalize());

            this.particleStart.push(temp); // 처음 위치
            this.particleEnd.push(temp.clone().normalize().multiplyScalar(this.particleLength)); // 처음위치에서 방향그대로 길이 particle length 만큼 증가
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial( { color: new THREE.Color(1.0, 1.0, 1.0) } );
        material.size = this.particleInitSize;
        material.depthTest = false;
        let hitParticle = new THREE.Points( geometry, material );
        hitParticle.name = 'particle';
        this.object.add( hitParticle );
    }

    #centerInit()
    {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
        const material = new THREE.PointsMaterial( { color: this.luminance } );
        material.size = 0.1;
        material.depthTest = false;
        let hitCenter = new THREE.Points( geometry, material );
        hitCenter.name = 'center';
        this.object.add( hitCenter );
    }

    Update(dt)
    {
        const term = 0.1;
        // const dt = Clock.getDelta();
    
        this.#particleUpdate(term, dt);
        this.#centerUpdate(term, dt);
    
        this.timeElapse += dt;
    }

    #particleUpdate(term, dt)
    {
        const particleObj = this.object.getObjectByName('particle');
        if (this.timeElapse >= this.duration + term || this.timeElapse < term)
        {
            particleObj.visible = false;
            // console.log(time);
            // console.log('delta time : ' + dt);
        }
        else
        {
            particleObj.visible = true;
            // 설정한 거리를 설정한 시간에 도달할 수 있도록 통제하는 코드를 만들어야 함 : lerp
            let myTimeElapse = this.timeElapse - term;
            let t = myTimeElapse / this.duration;
            // t = Math.sin(t * Math.PI * 1/2);
            t = -pow(t-1, 4) + 1; // (0, 0) , (1, 1) : 0~1 4제곱 그래프

            const positions = particleObj.geometry.attributes.position.array;
            for (let i=0; i<numParticles; ++i)
            {
                let cur = new THREE.Vector3(positions[i*3], positions[i*3 + 1], positions[i*3 + 2]);
                cur.lerpVectors(this.particleStart[i], this.particleEnd[i], t);
                
                positions[ i*3   ] = cur.x;
                positions[ i*3+1 ] = cur.y;
                positions[ i*3+2 ] = cur.z;
            }

            //lerp 그냥 구현, three js 에 float lerp 가 있는지 모르겠음
            particleObj.material.size = this.particleInitSize - ( this.particleInitSize - 0.0 ) * t; 
        }
        
        particleObj.geometry.attributes.position.needsUpdate = true;
        particleObj.material.needsUpdate = true;
    }

    #centerUpdate(term, dt)
    {
        const CenterObj = this.object.getObjectByName('center');
        // console.log(CenterObj.material.color);
        if (this.timeElapse > term)
        {
            // hitPosition.getObjectByName('center').material.color = new THREE.Color(0x00ff00);
            CenterObj.visible = false;
        }
        // hitPosition.getObjectByName('center').material.color.addScalar(-1.0);

        // hitPosition.getObjectByName('center').material.needsUpdate = true; // 이거 필요없?음
    }
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

export { hitEffect };