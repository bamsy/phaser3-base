/**
 * Base class for a Player
 */
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        this.offsetY = 19;
        this.offsetX = 48;
        this.circleRadius = 150;
        this.body.setOffset(this.offsetX, this.offsetY);
        this.body.setCircle(this.circleRadius);
        scene.add.existing(this);
        this.setMovement();

        // Variable to control the walking animation since it will override the shooting
        // animation when running and shooting.
        this.stopWalking = false;

        // set animation listener
        this.on('animationstart', this.animationStart, this);
        this.on('animationcomplete', this.animationComplete, this);

        // Set life and immunity values
        this.immune = false;
        this.immuneTime = 1000;
        this.maxHealth = 3;
        this.health = 3;
        this.alpha = 1;

        // Set up health bar
        this.hbWidth = this.circleRadius;
        this.hbHeight = 5;
        this.hbBg = '0x651828';
        this.hbFg = '0x004c00';
        this.rectBg = null;
        this.rectFg = null;
    }

    playerHitCallback(player, enemy) {
        if (!player.immune) {
            player.immune = true;
            player.health -= 1; // can change to enemy damage value later
            // update health bar
            player.updateHealthBar();
            // Cant seem to find an easy way to do this
            player.body.checkCollision.none = true;
            player.alpha = 0.25;
            // set up immunity, this doesn't seem right
            this.scene.scene.time.delayedCall(player.immuneTime, (p) => {
                p.immune = false;
                player.alpha = 1;
                // reset body physics
                p.body.checkCollision.none = false;
            }, [player], this);
        }
    }

    update(enemy, time, scene) {
        scene.physics.add.collider(this, enemy, this.playerHitCallback, null, scene);
        this.updateHealthBarPosition();
    }


    setMovement() {
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
    walkWithGun(state) {
        this.anims.play('player_walk_gun', state);
    }

    /**
     * Plays the pistol shot animation if passed true,
     * Stops the animation if passed false.
     * @param {Boolean} state 
     */
    firePistol(state) {
        this.anims.play('player_pistol_shot', state);
    }

    // This method is called whenever an animation is started for a player.
    // The walking animation was overriding the shooting animation in some cases
    // so I had to create a variable to control when the walking animation played.
    // Basically I turn the walking animation off when the gun is firing.
    animationStart(animation, frame, sprite) {
        if (animation.key === 'player_pistol_shot') {
            sprite.stopWalking = true;
        }
    }

    // This method is called whenver an animation is ended for a player.
    animationComplete(animation, frame, sprite) {
        if (animation.key === 'player_pistol_shot') {
            sprite.stopWalking = false;
        }
    }

    // Health bar should probably be its own class, 
    createHealthBar() {
        this.rectBg = this.scene.add.rectangle(this.x,this.y-this.offsetY, this.hbWidth, this.hbHeight, this.hbBg);
        this.rectFg = this.scene.add.rectangle(this.x,this.y-this.offsetY, this.hbWidth, this.hbHeight, this.hbFg);
    }
    // health bar position
    updateHealthBarPosition() {
        this.rectBg.setPosition(this.x, this.y-this.offsetY);
        this.rectFg.setPosition(this.x, this.y-this.offsetY);
    }
    // Update foreground
    updateHealthBar() {
        // Calculate the new size of the health bar
        if (this.health >= 0) {
            let newWidth = this.health / this.maxHealth * this.hbWidth;
            this.rectFg.setSize(newWidth, this.hbHeight);
        }
    }
}

export default Player;