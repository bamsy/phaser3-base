/**
 * Base class for an enemy
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
    }

    moveToTarget (target) {
        console.log('moving towards: ' + target);
        let speed = 150;
        let direction = Math.atan((target.x - this.x) / (target.y - this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y) {
            this.body.setVelocityX(speed * Math.sin(direction));
            this.body.setVelocityY(speed * Math.cos(direction));
        }
        else {
            this.body.setVelocityX(-speed * Math.sin(direction));
            this.body.setVelocityY(-speed * Math.cos(direction));
        }
    }
}

export default Enemy;
