class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        })
    }
    preload() {       
        const progress = this.add.graphics()
        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            progress.clear()
            progress.fillStyle(0xffffff, 1)
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60)
        })

        this.load.on('complete', () => {
            progress.destroy();
            this.scene.start('TitleScene');
        });

        // background
        this.load.image('background', 'assets/images/tile_grass-600x600.jpg')

        // Texture packer will do this for us
        this.load.atlas('mario-sprites', 'assets/images/mario-sprites.png', 'assets/images/mario-sprites.json');

        // Load font
        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        
    }
    
}

export default BootScene