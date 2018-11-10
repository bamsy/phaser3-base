/**
 * Base Class for a Spawner
 * http://www.html5gamedevs.com/topic/21724-spawning-enemies-at-random-period/
 */
class Spawner {
    constructor (entity, spawnerEnabled) {
        this.entity = entity;
        this.spawnerEnabled = spawnerEnabled;
    }

    // took this from player, we need to set collision in the spawn function of the spawnable obj
    // scene.physics.add.collider(scene.enemy, bullet, scene.enemyHitCallback);
}

export default Spawner;
