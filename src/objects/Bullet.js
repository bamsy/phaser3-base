/**
 * Base Class for a Bullet
 */
class Bullet extends Phaser.GameObjects.Image {
    constructor (scene) {
        super(scene);
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 1000;
        this.born = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12, true);
        this.gunLength = 20; // this should be a parameter probably
        this.gunWidth = 25; // the amount the gun is being held left or right of center
    }

    fire (shooter, target) {
        this.scene.sound.play('pistol');

        // i think the player sprite is rotated from what is logical
        // ie we dont shoot bullets out of his 0 degre, we shoot bullets out of his 90 degree
        // or something
        let direction = Math.atan((target.x - shooter.x) / (target.y - shooter.y));

        this.setPosition(shooter.x + (this.gunLength * Math.cos(shooter.rotation)) + (this.gunWidth * Math.cos(shooter.rotation + (Math.PI / 2))),
            shooter.y + (this.gunLength * Math.sin(shooter.rotation)) + (this.gunWidth * Math.sin(shooter.rotation + (Math.PI / 2))));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= shooter.y) {
            this.body.setVelocityX(this.speed * Math.sin(direction));
            this.body.setVelocityY(this.speed * Math.cos(direction));
        }
        else {
            this.body.setVelocityX(-this.speed * Math.sin(direction));
            this.body.setVelocityY(-this.speed * Math.cos(direction));
        }

        this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    }

    update (time, delta) {
        this.born += delta;
        if (this.born > 1800) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

export default Bullet;
