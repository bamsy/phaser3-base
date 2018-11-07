/**
 * Base class for an enemy
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setBounce(0.8);
        //this.body.setCircle(22);
    }
}

export default Enemy;
