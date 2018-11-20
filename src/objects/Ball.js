/**
 * Base class for a ball
 */
class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setCircle(30);
        this.body.setOffset(8, 8);
        this.body.setBounce(0.8);
        this.body.setDrag(100,100)

        this.velocityPercent = 0.75 // percentage of imparted speed
    }

    ballHitCallback (ballHit, bulletHit) {
        
        // Set up ball physics to move on hit
        ballHit.body.velocity.x += (bulletHit.body.velocity.x)
        ballHit.body.velocity.y += (bulletHit.body.velocity.y)
        
        // bulletHit.setActive(false).setVisible(false).destroy();
        bulletHit.kill()
        

    }
}

export default Ball;
