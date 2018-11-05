/**
 * Base class for the reticle
 */
class Reticle extends Phaser.Physics.Arcade. Sprite {
    constructor(scene,x,y,texture,frame) {
        super(scene,x,y,texture,frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setMovement();
    }

    setMovement() {
        let reticle = this;
        // Move reticle upon locked pointer move
        reticle.scene.input.on('pointermove', function (pointer) {
            if (reticle.scene.input.mouse.locked)
            {
                reticle.x += pointer.movementX;
                reticle.y += pointer.movementY;
            }
        }, reticle.scene);
    }
}

export default Reticle;