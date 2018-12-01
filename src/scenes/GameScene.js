import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Reticle from '../objects/Reticle';
import Ball from '../objects/Ball';
import Spawner from '../objects/Spawner';

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });

        // props
        this.player = null;
        this.ball = null;
        this.enemySpawner = null;
        this.enemies = null;
        this.healthpoints = null;
        this.reticle = null;
        this.hp1 = null;
        this.hp2 = null;
        this.hp3 = null;
        this.worldX = 800;
        this.worldY = 600;
        this.leftGoals = 0;
        this.rightGoals = 0;
        this.weapon = null;
    }

    preload() {
        // Set world bounds
        this.physics.world.setBounds(0, 0, this.worldX, this.worldY);
        // import weapon plugin
        this.load.scenePlugin('WeaponPlugin', 'plugins/WeaponPlugin.min.js', null, 'weapons');
    }
    create () {
        // create music
        this.music = this.sound.add('music', { volume: 0.5 });
        this.music.loop = true;
        this.music.play();

        // create gun shot sound
        this.gunshot = this.sound.add('gunshot', { volume: 0.5 });
        this.fleshwound = this.sound.add('fleshhit', { volume: 0.5 });
        this.ballhit = this.sound.add('ballhit', { volume: 0.5 });

        // Set world bounds
        this.physics.world.setBounds(0, 10, this.worldX, this.worldY);

        // Add 2 groups for Bullet objects
        // this.playerBullets = this.physics.add.group({
        //     classType: Bullet,
        //     runChildUpdate: true
        // });

        // Add background player, reticle, healthpoint sprites
        let background = this.add.image(0, 10, 'background');

        // Set image/sprite properties
        background.setOrigin(0.5, 0.5).setDisplaySize(this.worldX, this.worldY);

        this.player = new Player(this, 650, 300, 'player_handgun');
        this.player.createHealthBar(this.game);


        //  Creates 30 bullets, using the 'bullet' graphic
        this.weapon = this.weapons.add(30, 'bullet');

        let playshot = this.playshot;
        this.weapon.eventEmitter.addListener('fire', playshot, this);

        // scale bullets
        this.weapon.bullets.children.each((b) => {
            b.setScale(0.3);
            b.body.updateBounds();
        });

        this.weapon.debugPhysics = true;
        this.weapon.bulletKillType = WeaponPlugin.consts.KILL_WORLD_BOUNDS;
        this.weapon.bulletLifespan = 500;

        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 600;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 600ms
        this.weapon.fireRate = 600;

        // Add 2 groups for Bullet objects
        // this.enemyBullets = this.physics.add.group({
        //     classType: Bullet,
        //     runChildUpdate: true
        // });

        this.physics.add.existing(this.player);
        this.weapon.trackSprite(this.player, 0, 0, true);

        // create a list and spawner for enemies
        this.enemies = [];

        let spawnerOptions = {
            lowerInterval: 2500,
            upperInterval: 5000,
            enabled: true,
            maxObjects: 4
        };

        let spawnOptions = {
            collisionTarget: this.player
        };

        this.enemySpawner = new Spawner(Enemy, this.enemies, this, 150, 300, 'zombie3_walk0', spawnerOptions, spawnOptions);
        this.ball = new Ball(this, 400, 300, 'ball');
        this.reticle = new Reticle(this, 400, 300, 'reticle');
        this.physics.add.collider(this.player, this.ball);

        // Set image/sprite properties
        background.setOrigin(0, 0).setDisplaySize(this.worldX, this.worldY);

        this.ball.setOrigin(0.5, 0.5).setCollideWorldBounds(true).setDrag(10, 10);
        this.player.setOrigin(0.5, 0.5).setScale(0.15).setCollideWorldBounds(true).setDrag(500, 500);
        this.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);

        // Set sprite variables
        this.player.health = 3;

        // Set camera properties
        // this line is the reason our 800*600 field takes up 1/4 of the 800*600 viewport
        // i think we'd be better off with this at 0 and leaving some space at the top of the view port for info
        // this.physics.world.setBounds(0, 50, this.worldX, this.worldY);
        // or something
        this.cameras.main.zoom = 1;

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
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set up score -- probably make this into helper function?
        this.scoreDisplay = this.add.bitmapText(0, 0, 'font', 'SCORE: 0');
        this.scoreDisplay.fill = '0xffffff';
        this.score = 0;
    }

    playshot () {
        this.gunshot.play();
    }
    update (time, delta) {
        let scene = this;

        // Check for bullet collision with ball
        this.physics.add.overlap(this.ball, this.weapon.bullets, this.ball.ballHitCallback, null, this);

        // Rotates player to face towards reticle
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

        // animate the player if they are moving
        // stop the animation when they aren't
        if ((this.player.body.acceleration.x !== 0 || this.player.body.acceleration.y !== 0) && !this.player.stopWalking) {
            this.player.walkWithGun(true);
        }

        // Make reticle move with player
        this.reticle.body.velocity.x = this.player.body.velocity.x;
        this.reticle.body.velocity.y = this.player.body.velocity.y;

        if (this.input.activePointer.isDown) {
            this.weapon.fire();
            this.player.firePistol(true);
        }

        // Constrain velocity of player
        this.constrainVelocity(this.player, 500);

        this.enemies.forEach(enemy => {
            enemy.update(this.player, time, scene);
            this.player.updateEnemyCollision(enemy, time, scene);
            this.ball.ballEnemyUpdate(this.ball, enemy, scene);
        });
        this.checkGoal();

        this.enemySpawner.spawn(time);
        this.player.update();
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

        if (this.ball.body.top >= 200 && this.ball.body.bottom <= (this.worldY - 200)) {
            if (this.ball.body.left <= this.physics.world.bounds.left) {
                this.goalScored(true);
            } else if (this.ball.body.right >= this.physics.world.bounds.right) {
                this.goalScored(false);
            }
        }
    }

    goalScored (isLeft) {
        if (isLeft) {
            this.leftGoals++;
            this.updateScore(10);
            console.log('LEFT SCORE! ' + this.leftGoals);
        } else {
            this.rightGoals++;
            this.updateScore(-10);
            console.log('RIGHT SCORE! ' + this.rightGoals);
        }        

        this.ball.setX(400);
        this.ball.setY(300);

        // the ball will tend to roll a bit more left/right than up/down
        this.ball.body.setVelocity((Math.random()-0.5)*200, (Math.random()-0.5)*100);
    }

    restartScene () {
        this.scene.restart();
    }


    // Set up scoring
    updateScore (value) {
        this.score += value;
        this.scoreDisplay.setText('SCORE: ' + this.score);
    }
}

export default GameScene;
