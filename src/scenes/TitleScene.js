class TitleScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'TitleScene'
        });
    }
    create() {
        this.pressX = this.add.bitmapText(16 * 8 + 4, 8 * 16, 'font', 'PRESS SPACE TO START', 8);
        this.blink = 1000;
    }
    update(time, delta) {
        this.blink -= delta;
        if (this.blink < 0) {
            this.pressX.alpha = this.pressX.alpha === 1 ? 0 : 1;
            this.blink = 500;
        }
    }
}

export default TitleScene