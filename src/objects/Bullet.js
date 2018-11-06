/**
 * Base Class for a Bullet
 */
class Bullet extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene)
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
        this.gunLength = 60; // this should be a parameter probably
    }

    fire(shooter,target) {

        this.scene.sound.play('pistol')

        // i think the player sprite is rotated from what is logical
        // ie we dont shoot bullets out of his 0 degre, we shoot bullets out of his 90 degree
        // or something
        this.direction = Math.atan((target.x-shooter.x) / (target.y-shooter.y));
        this.setPosition(shooter.x+(this.gunLength*Math.cos(shooter.rotation)), shooter.y+(this.gunLength*Math.sin(shooter.rotation)))

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= shooter.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    }

    update(time,delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

export default Bullet;