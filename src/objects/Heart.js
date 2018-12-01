/**
 * Base class for a ball
 */
class Heart extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.scene = scene;
    }

    destroyHeart () {
        this.destroyed = true;
        this.destroy();
    }
}

export default Heart;
