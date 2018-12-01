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
        this.isRandom = spawnerOptions.isRandom || false;
        this.maxWidth = spawnerOptions.maxWidth || 0;
        this.maxHeight = spawnerOptions.maxHeight || 0;

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
            if (!this.isRandom) {
                this.entities.push(this.entity.spawn(this.spawnOptions, this.scene, this.x, this.y, this.texture));
            } else {
                let rngX = Math.floor(Math.random() * this.maxWidth);
                let rngY = Math.floor(Math.random() * this.maxHeight);
                
                this.entities.push(this.entity.spawn(this.spawnOptions, this.scene, rngX, rngY, this.texture));
            }
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
