/**
 * Base class for the reticle
 */
class Reticle extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setMovement();
    }

    setMovement () {
        let reticle = this;

        // Move reticle upon locked pointer move
        reticle.scene.input.on('pointermove', function (pointer) {
            if (reticle.scene.input.mouse.locked) {
                reticle.x += pointer.movementX;
                reticle.y += pointer.movementY;
            }
        }, reticle.scene);
    }

    // Ensures reticle does not move offscreen
    update () {
        let reticle = this;
        var distX = reticle.x - reticle.scene.player.x; // X distance between player & reticle
        var distY = reticle.y - reticle.scene.player.y; // Y distance between player & reticle

        // Ensures reticle cannot be moved offscreen (player follow)
        if (distX > 800) {
            reticle.x = reticle.scene.player.x + 800;
        }
        else if (distX < -800) {
            reticle.x = reticle.scene.player.x - 800;
        }

        if (distY > 600) {
            reticle.y = reticle.scene.player.y + 600;
        }
        else if (distY < -600) {
            reticle.y = reticle.scene.player.y - 600;
        }
    }
}

export default Reticle;
