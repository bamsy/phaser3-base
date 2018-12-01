/**
 * This Scene just shows the score and prompts user to restart
 */
class ScoreScene extends Phaser.Scene {
    constructor (test) {
        super({ key: 'ScoreScene' });
    }

    init (data)
    {
        console.log('init', data);

        this.score = data.score;
    }

    create () {
        this.pressX = this.add.bitmapText(200, 500, 'font', 'PRESS SPACE TO TRY AGAIN', 16);

        this.header = this.add.bitmapText(300, 0, 'font', 'YOUR SCORE:', 16);
        this.scoreDisplay = this.add.bitmapText(375, 250, 'font', this.score, 16);

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
            location.reload();
        }
    }
}

export default ScoreScene;
