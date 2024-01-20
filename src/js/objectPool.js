import * as THREE from 'three';

import { Effect } from './Effect.js';

class objectPool
{
    count;
    prefab = new Effect();
    pool = [];

    constructor( prefab, count = 20 )
    {
        this.prefab = prefab;
        this.count = count;
        this.Init();
    }

    Init()
    {
        for (let i = 0; i< this.count; ++i)
        {
            this.pool.push( this.prefab.Instantiate() );
        }
    }

    GetObject( position, direction )
    {
        for (let i =0; i<this.count; ++i)
        {
            if (this.pool[i].GetActive())
                continue;

            this.pool[i].SetPosition( position );
            this.pool[i].object.lookAt( direction.clone().add( this.pool[i].object.position ) ); // direction + object.position
            this.pool[i].SetActive( true );
            return this.pool[i];
        }

        return null;
    }

    Update(dt)
    {
        let cnt = 0;
        for (let i =0; i<this.count; ++i)
        {
            this.pool[i].Update(dt);
            if (this.pool[i].GetActive())
            {
                // console.log(this.pool[i]);
                ++cnt;
            }
        }
        console.log(cnt);
    }
}

export { objectPool };