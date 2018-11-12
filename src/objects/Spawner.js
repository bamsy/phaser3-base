/**
 * Base Class for a Spawner
 */
class Spawner {
    constructor (entity, entities, scene, x, y, texture, options) {
        this.entity = entity;
        this.entities = entities;
        this.scene = scene;
        this.x = x || 0;
        this.y = y || 0;
        this.texture = texture;
        this.enabled = options.enabled;
        this.lowerInterval = options.lowerInterval;
        this.upperInterval = options.upperInterval;
        this.maxObjects = options.maxObjects || 15;
        this.lastSpawn = 0;

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
            console.log('spawning');

            this.lastSpawn = time;

            this.entities.push(this.entity.spawn(this.scene, this.x, this.y, this.texture));
        }
    }
}

export default Spawner;
