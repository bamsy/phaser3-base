/**
 * Base Class for a Spawner
 */
class Spawner {
    constructor (entity, entities, scene, x, y, texture, spawnerOptions, spawnOptions) {
        this.entity = entity;
        this.entities = entities;
        this.scene = scene;
        this.x = x || 0;
        this.y = y || 0;
        this.texture = texture;
        this.enabled = spawnerOptions.enabled;
        this.lowerInterval = spawnerOptions.lowerInterval;
        this.upperInterval = spawnerOptions.upperInterval;
        this.maxObjects = spawnerOptions.maxObjects || 15;
        this.lastSpawn = 0;
        this.spawnOptions = spawnOptions || {};

        if (!this.lowerInterval) {
            this.lowerInterval = this.upperInterval || 5000;
        }

        if (!this.upperInterval) {
            this.upperInterval = this.lowerInterval;
        }

        if (!entity.spawn || typeof entity.spawn !== 'function') {
            throw new Error('Entity must have a function called spawn to handle spawning logic');
        }
    }

    spawn (time) {
        let interval = Math.floor(Math.random() * (this.upperInterval - this.lowerInterval + 1)) + this.lowerInterval;

        if (this.enabled && this.entities.length < this.maxObjects && (time - this.lastSpawn) > interval) {
            this.lastSpawn = time;

            this.entities.push(this.entity.spawn(this.spawnOptions, this.scene, this.x, this.y, this.texture));
        }

        // remove entities that have been marked as destroyed
        this.entities.forEach((e, index) => {
            if (e.destroyed) {
                this.entities.splice(index, 1);

                // give the player some time to breathe
                this.lastSpawn = time;
            }
        });
    }
}

export default Spawner;
