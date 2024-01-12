import * as THREE from 'three';


const numParticles = 30;
const gravity = -9.8;
const groundHeight = new THREE.Vector3(0, 0, 0);


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
    particleInitSize = 0.3;
    localGroundHeight;

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
        material.size = 0.2;
    
        this.object = new THREE.Points( geometry, material );
    
        // calculate random explostion location
        let half = origin.clone().add(t1).multiplyScalar(0.5);
        let perpendicular = generateRandomPerpendicularVector(half);
        perpendicular.normalize();
        let explosionLoc = half.clone().add(perpendicular.multiplyScalar(0.5));
        explosionLoc.y += -0.6; // 피가 아래에서 위로 튀기도록 하기 위함
    
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

            this.velocity[ cur     ] = this.initVelocity[ cur     ];
            this.velocity[ cur + 1 ] = this.initVelocity[ cur + 1 ];
            this.velocity[ cur + 2 ] = this.initVelocity[ cur + 2 ];
        }
    }

    SetPosition(vec3)
    {        
        this.object.position.set(
            vec3.x + Math.random() * 0.2 - 0.1, 
            vec3.y + Math.random() * 0.2 - 0.1, 
            vec3.z + Math.random() * 0.2 - 0.1
        );
        
        let target;
        target = this.object.worldToLocal(groundHeight);
        this.localGroundHeight = target.y;
        console.log('target . y', target.y);
        console.log('local ground height : ' , this.localGroundHeight);
    }

    SetActive(active)
    {
        this.active = active;

        if (active)
        {
            console.log('set active true', this.active);
            this.object.visible = true;
            console.log('object position : ', this.object.position);
        }
        else
        {
            console.log('set active false', this.active);
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
    
        const positions = this.object.geometry.attributes.position.array;
        
        for ( let i = 0; i < numParticles; i++ ) {
            let cur = i * 3;
            
            // if (positions[ cur + 1 ] <= this.localGroundHeight)
            // {
            //     positions[ cur + 1] = this.localGroundHeight;
            //     continue;
            // }
            
            this.velocity[ cur     ];
            this.velocity[ cur + 1 ] += gravity * dt;
            this.velocity[ cur + 2 ];
            
            positions[ cur     ] += this.velocity[ cur     ] * dt;
            positions[ cur + 1 ] += this.velocity[ cur + 1 ] * dt;
            positions[ cur + 2 ] += this.velocity[ cur + 2 ] * dt;
        
        }
    
        this.object.geometry.attributes.position.needsUpdate = true;

        let t = (this.timeElapse / this.duration);
        this.object.material.size = ( this.particleInitSize - 0.0 ) * Math.cos(t * Math.PI / 2); 
        
        this.timeElapse += dt;
    }
 
    
    Reset()
    {
        const positions = this.object.geometry.attributes.position.array;
        for (let i=0; i<numParticles; ++i)
        {   
            this.velocity[i*3] = this.initVelocity[i];
            this.velocity[i*3+1] = this.initVelocity[i*3+1];
            this.velocity[i*3+2] = this.initVelocity[i*3+1];
            
            positions[ i*3   ] = this.particleStart[i].x;
            positions[ i*3+1 ] = this.particleStart[i].y;
            positions[ i*3+2 ] = this.particleStart[i].z;
        }

        this.timeElapse = 0;
        this.object.geometry.attributes.position.needsUpdate = true;

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