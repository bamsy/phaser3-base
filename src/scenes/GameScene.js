class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        })
    }
    preload() {
        // this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }
}

export default GameScene