import Bullet from '../objects/Bullet';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Reticle from '../objects/Reticle';
import Ball from '../objects/Ball';

class GameScene extends Phaser.Scene {
    constructor (test) {
        super({ key: 'GameScene' });

        // props
        this.player = null;
        this.enemySpawner = null;
        this.enemy = null;
        this.healthpoints = null;
        this.reticle = null;
        this.moveKeys = null;
        this.playerBullets = null;
        this.enemyBullets = null;
        this.hp1 = null;
        this.hp2 = null;
        this.hp3 = null;
        this.worldX = 1600;
        this.worldY = 1200;
        this.leftGoals = 0;
        this.rightGoals = 0;
    }

    preload () {
        // Load in images and sprites
        this.load.spritesheet('player_handgun', 'assets/images/sprites/player_handgun.png', { frameWidth: 66, frameHeight: 60 });
        this.load.image('bullet', 'assets/images/sprites/bullet6.png');
        this.load.image('target', 'assets/images/demoscene/ball.png');
        this.load.image('background', 'assets/images/skies/underwater1.png');
        this.load.image('gunfire', 'assets/images/sprites/fire1_01.png');
        this.load.audio('pistol', 'assets/sounds/pistol.mp3');
        this.load.audio('shotgun', 'assets/sounds/shotgun.mp3');
    }

    create () {
        // Set world bounds
        this.physics.world.setBounds(0, 0, this.worldX, this.worldY);

        // Add 2 groups for Bullet objects
        this.playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        // Add background player, enemy, reticle, healthpoint sprites
        let background = this.add.image(800, 600, 'background');

        this.player = new Player(this, 800, 600, 'player_handgun');
        this.enemy = new Enemy(this, 300, 600, 'player_handgun');
        this.ball = new Ball(this, 550, 600, 'target');

        this.reticle = new Reticle(this, 800, 700, 'target');
        this.hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0.5, 0.5);
        this.hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0.5, 0.5);
        this.hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0.5, 0.5);

        // Set image/sprite properties
        background.setOrigin(0.5, 0.5).setDisplaySize(this.worldX, this.worldY);
        this.ball.setOrigin(0.5, 0.5).setDisplaySize(200, 200).setCollideWorldBounds(true).setDrag(10, 10);
        this.player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
        this.enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);
        this.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
        this.hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        this.hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        this.hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

        // Set sprite variables
        this.player.health = 3;

        this.enemy.health = 3;

        // Set camera properties
        this.cameras.main.zoom = 0.5;
        this.cameras.main.startFollow(this.player);

        // Fires bullet from player on left click of mouse
        this.player.bulletFireSetup();

        this.physics.add.collider(this.player, this.enemy);
        this.physics.add.collider(this.player, this.ball);

        // Pointer lock will only work after mousedown
        let game = this.game;
        game.canvas.addEventListener('mousedown', function () {
            game.input.mouse.requestPointerLock();
        });

        // Exit pointer lock when Q or escape (by default) is pressed.
        this.input.keyboard.on('keydown_Q', function (event) {
            if (game.input.mouse.locked) {
                game.input.mouse.releasePointerLock();
            }
        }, 0, this);
    }

    update (time, delta) {
        // Rotates player to face towards reticle
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

        // Rotates enemy to face towards player
        this.enemy.rotation = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);

        // Make reticle move with player
        this.reticle.body.velocity.x = this.player.body.velocity.x;
        this.reticle.body.velocity.y = this.player.body.velocity.y;

        // Constrain velocity of player
        this.constrainVelocity(this.player, 500);

        if (this.enemy.active) {
            this.enemy.moveToTarget(this.player);
        }
        this.checkGoal();
    }

    enemyHitCallback (enemyHit, bulletHit) {
        // Reduce health of enemy
        if (bulletHit.active === true && enemyHit.active === true) {
            enemyHit.health = enemyHit.health - 1;
            console.log('Enemy hp: ', enemyHit.health);

            // Kill enemy if health <= 0
            if (enemyHit.health <= 0) {
                enemyHit.setActive(false).setVisible(false);
            }

            // Destroy bullet
            bulletHit.setActive(false).setVisible(false);
        }
    }

    playerHitCallback (playerHit, bulletHit) {
        // Reduce health of player
        let scene = playerHit.scene;

        if (bulletHit.active === true && playerHit.active === true) {
            playerHit.health = playerHit.health - 1;
            console.log('Player hp: ', playerHit.health);

            // Kill hp sprites and kill player if health <= 0
            if (playerHit.health === 2) {
                scene.hp3.destroy();
            }
            else if (playerHit.health === 1) {
                scene.hp2.destroy();
            }
            else {
                scene.hp1.destroy();

                // Game over state should execute here
            }

            // Destroy bullet
            bulletHit.setActive(false).setVisible(false);
        }
    }

    ballHitCallback (ballHit, bulletHit) {
        bulletHit.setActive(false).setVisible(false).destroy();
    }

    // Ensures sprite speed doesnt exceed maxVelocity while update is called
    constrainVelocity (sprite, maxVelocity) {
        if (!sprite || !sprite.body) {
            return;
        }

        var angle, currVelocitySqr, vx, vy;
        vx = sprite.body.velocity.x;
        vy = sprite.body.velocity.y;
        currVelocitySqr = vx * vx + vy * vy;

        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(vy, vx);
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            sprite.body.velocity.x = vx;
            sprite.body.velocity.y = vy;
        }
    }

    checkGoal () {
        // just for now, the net starts 200 pixels below the top of the world,
        // and ends 200 pixels above the top of the world

        if (this.ball.body.top >= 400 && this.ball.body.bottom <= (this.worldY - 400)) {
            if (this.ball.body.left <= this.physics.world.bounds.left) {
                this.goalScored(true);
            }
            else if (this.ball.body.right >= this.physics.world.bounds.right) {
                this.goalScored(false);
            }
        }
    }

    goalScored (isLeft) {
        if (isLeft) {
            this.leftGoals++;
            console.log('LEFT SCORE! ' + this.leftGoals);
        }
        else {
            this.rightGoals++;
            console.log('RIGHT SCORE! ' + this.rightGoals);
        }

        this.ball.setVelocityX(0);
        this.ball.setVelocityY(0);
        this.ball.setX(800);
        this.ball.setY(600);
    }
}

export default GameScene;
