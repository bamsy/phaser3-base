/**
 * 
 * Resources:
 * Keyboard events
 * http://www.html5gamedevs.com/topic/36693-problems-with-keyboard-events/
 * Key codes
 * https://github.com/photonstorm/phaser/blob/v3.14.0/src/input/keyboard/keys/KeyCodes.js
 */
class TitleScene extends Phaser.Scene {
    constructor (test) {
        super({ key: 'TitleScene' });
    }
    create () {
        this.pressX = this.add.bitmapText(200, 500, 'font', 'PRESS SPACE TO TRY AGAIN', 16);

        this.header = this.add.bitmapText(300, 0, 'font', 'CONTROLS', 16);
        this.movement = this.add.bitmapText(300, 250, 'font', 'MOVEMENT - WASD', 16);
        this.aim = this.add.bitmapText(300, 275, 'font', 'AIM - MOUSE', 16);
        this.shoot = this.add.bitmapText(300, 300, 'font', 'SHOOT - LEFT CLICK', 16);

        this.blink = 1000;

        // register 'space' to transition to game screen
        this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update (time, delta) {
        this.blink -= delta;
        if (this.blink < 0) {
            this.pressX.alpha = this.pressX.alpha === 1 ? 0 : 1;
            this.blink = 500;
        }

        // Set startKey to actually start the game
        if (this.startKey.isDown) {
            this.scene.start('GameScene');
        }
    }
}

export default TitleScene;
