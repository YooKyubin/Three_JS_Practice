import * as THREE from 'three';

class Effect
{
    object = new THREE.Object3D();
    duration = 1;
    targetPosition = new THREE.Vector3(0, 0, 0);
    active = false;

    timeElapse = 0;

    // virtual function 만드는 법 모름
    constructor( ) { }

    Instantiate() 
    {
    }

    #init() { }    
    SetPosition(vec3) { }

    SetActive(active) { }
    GetActive() { return this.active; }

    Update(dt) { }

}

export { Effect };