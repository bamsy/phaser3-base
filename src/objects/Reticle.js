/**
 * Base class for the reticle
 */
class Reticle extends Phaser.Physics.Arcade. Sprite {
    constructor(scene,x,y,texture,frame) {
        super(scene,x,y,texture,frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
    }
}

export default Reticle;