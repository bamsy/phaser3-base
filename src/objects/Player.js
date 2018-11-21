/**
 * Base class for a Player
 */
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        this.body.setOffset(48, 19);
        this.body.setCircle(150);
        scene.add.existing(this);
        this.setMovement();
    }

    setMovement () {
        // Assign this to a variable so we can use it.
        let player = this;
        console.log(player);

        // Creates object for input with WASD kets
        let moveKeys = player.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Enables movement of player with WASD keys
        player.scene.input.keyboard.on('keydown_W', function (event) {
            player.setAccelerationY(-800);
        });
        player.scene.input.keyboard.on('keydown_S', function (event) {
            player.setAccelerationY(800);
        });
        player.scene.input.keyboard.on('keydown_A', function (event) {
            player.setAccelerationX(-800);
        });
        player.scene.input.keyboard.on('keydown_D', function (event) {
            player.setAccelerationX(800);
        });

        // Stops player acceleration on uppress of WASD keys
        player.scene.input.keyboard.on('keyup_W', function (event) {
            if (moveKeys['down'].isUp) {
                player.setAccelerationY(0);
            }
        });
        player.scene.input.keyboard.on('keyup_S', function (event) {
            if (moveKeys['up'].isUp) {
                player.setAccelerationY(0);
            }
        });
        player.scene.input.keyboard.on('keyup_A', function (event) {
            if (moveKeys['right'].isUp) {
                player.setAccelerationX(0);
            }
        });
        player.scene.input.keyboard.on('keyup_D', function (event) {
            if (moveKeys['left'].isUp) {
                player.setAccelerationX(0);
            }
        });
    }
    
    /**
     * Playes the walk with gun animation
     * @param {Boolean} state 
     */
    walkWithGun (state) {
        this.anims.play('player_walk_gun', state);
    }
}

export default Player;
