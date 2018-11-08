/**
 * Base class for a ball
 */
class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setCircle(40)
        this.body.setBounce(0.8);
    }
}

export default Ball;
