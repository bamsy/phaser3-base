/**
 * Base class for a ball
 */
class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.body.setCircle(48);
        this.body.setOffset(1, 0);
        this.body.setBounce(0.8);
        this.body.setDrag(100, 100);

        this.velocityPercent = 0.75; // percentage of imparted speed
        this.scene = scene;
    }

    ballHitCallback (ballHit, bulletHit) {
        // Set up ball physics to move on hit
        ballHit.body.velocity.x += (bulletHit.body.velocity.x);
        ballHit.body.velocity.y += (bulletHit.body.velocity.y);
        
        // bulletHit.setActive(false).setVisible(false).destroy();
        bulletHit.kill();

        ballHit.scene.ballhit.play();
    }

    /*ballEnemyUpdate (ball, enemy, scene) {
        scene.physics.add.collider(ball, enemy, this.ballEnemyCallback, null, scene);
    }

    ballEnemyCallback (ball, enemy) {
        // ball.velocity.x = 0;
        // ball.velocity.y = 0;
        // ball.acceleration.x = 0;
        // ball.acceleration.y = 0;
    }*/
}

export default Ball;
