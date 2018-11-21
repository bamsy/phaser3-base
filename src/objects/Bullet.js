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
        this.gunLength = 20; // this should be a parameter probably
        this.gunWidth = 25; // the amount the gun is being held left or right of center
        this.scaleX = 0.1;
        this.scaleY = 0.1;
    }
}

export default Bullet;
