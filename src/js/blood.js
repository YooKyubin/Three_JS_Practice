import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

const numParticles = 100;


const gravity = -9.8;
const Clock = new THREE.Clock();


class blood
{
    object = new THREE.Object3D();
    duration = 1;
    targetPosition = new THREE.Vector3(0, 0, 0);
    active = false;
    
    timeElapse = 0;
    
    particles;
    particleStart = []
    velocity = new Float32Array( numParticles * 3 );
    initVelocity = new Float32Array( numParticles * 3 );

    // virtual function 만드는 법 모름
    constructor( ) 
    { 
        this.#init();
        this.SetActive( false );
    }

    Instantiate() 
    {
        return new blood();
    }

    #init() 
    {
        this.velocity = new Float32Array( numParticles * 3 );
    
        // random line generate
        let origin = new THREE.Vector3(0, 0, 0);
        let t1 = origin.clone().add(new THREE.Vector3(Math.random(), Math.random(), Math.random()));
        t1.normalize();
    
        const vertices = [];
        for ( let i = 0; i < numParticles; i++ ) {
            let step = (i / numParticles);
            const x = origin.x + step * (t1.x - origin.x);
            const y = origin.y + step * (t1.y - origin.y);
            const z = origin.z + step * (t1.z - origin.z);
            
            vertices.push(x, y, z);
            let temp = new THREE.Vector3(x, y, z);
            this.particleStart.push(temp);
        }
    
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        const material = new THREE.PointsMaterial( { color: 0xff0000, sizeAttenuation: true } );
        material.size = 0.3;
    
        this.particles = new THREE.Points( geometry, material );
    
        // calculate random explostion location
        let half = origin.clone().add(t1).multiplyScalar(0.5);
        let perpendicular = generateRandomPerpendicularVector(half);
        perpendicular.normalize();
        let explosionLoc = half.clone().add(perpendicular.multiplyScalar(0.5));
        console.log("explotsionLoc : ", explosionLoc);
    
        for (let i=0; i<numParticles; ++i)
        {
            let cur = i * 3;
            let noise = Math.random() * 1+ 0;
        
            let initVec = new THREE.Vector3(
                vertices[ cur     ] - explosionLoc.x + noise,
                vertices[ cur + 1 ] - explosionLoc.y + noise,
                vertices[ cur + 2 ] - explosionLoc.z + noise
            );
            initVec.normalize();
    
            this.initVelocity[ cur     ] = initVec.x * 4;
            this.initVelocity[ cur + 1 ] = initVec.y * 4;
            this.initVelocity[ cur + 2 ] = initVec.z * 4;
        }
    }

    SetPosition(vec3)
    {        
        this.object.position.set(
            vec3.x + Math.random() * 0.2 - 0.1, 
            vec3.y + Math.random() * 0.2 - 0.1, 
            vec3.z + Math.random() * 0.2 - 0.1
        );
    }

    SetActive(active)
    { 
        this.active = active;

        if (active)
        {
            this.object.visible = true;
        }
        else
        {
            this.object.visible = false;
        }
    }
    GetActive() { return this.active; }

    Update(dt) 
    {
        if (!this.active)
            return;
    
        if (this.timeElapse >= this.duration)
        {
            this.SetActive(false);
            this.Reset();
            return;
        }
    
        console.log(this.object);
        const positions = this.object.geometry.attributes.position.array;
        
        for ( let i = 0; i < numParticles; i++ ) {
            let cur = i * 3;
            
            if (positions[ cur + 1 ] <= 0)
            {
                positions[ cur + 1] = 0;
                continue;
            }
            
            velocity[ cur     ];
            velocity[ cur + 1 ] += gravity * dt;
            velocity[ cur + 2 ];
            
            positions[ cur     ] += velocity[ cur     ] * dt;
            positions[ cur + 1 ] += velocity[ cur + 1 ] * dt;
            positions[ cur + 2 ] += velocity[ cur + 2 ] * dt;
        
        }
    
        particles.geometry.attributes.position.needsUpdate = true;
        
        timeElapse += dt;
    }
 
    
    Reset()
    {
        this.velocity = this.initVelocity;
        const positions = this.object.geometry.attributes.position.array;
        for (let i=0; i<numParticles; ++i)
        {   
            positions[ i*3   ] = this.particleStart.x;
            positions[ i*3+1 ] = this.particleStart.y;
            positions[ i*3+2 ] = this.particleStart.z;
        }

        this.timeElapse = 0;
    }
}

function generateRandomPerpendicularVector( givenVector )
{
    var randomVector = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    
    // 주어진 벡터와 수직인 벡터를 찾기 위한 외적 계산
    var perpendicularVector = givenVector.clone().cross(randomVector);

    // 크기를 조절하여 길이가 length가 되도록
    let length = Math.random() * 1.0 + 0.1;
    var scaleFactor = length / perpendicularVector.length();

    perpendicularVector.multiplyScalar(scaleFactor);

    return perpendicularVector;
}

export { blood };