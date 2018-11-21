import Bullet from '../objects/Bullet';
import Player from '../objects/Player';
import Enemy from '../objects/Enemy';
import Reticle from '../objects/Reticle';
import Ball from '../objects/Ball';
import Spawner from '../objects/Spawner';

class GameScene extends Phaser.Scene {
    constructor (test) {
        super({ key: 'GameScene' });

        // props
        this.player = null;
        this.ball = null;
        this.enemySpawner = null;
        this.enemies = null;
        this.healthpoints = null;
        this.reticle = null;
        this.playerBullets = null;
        this.hp1 = null;
        this.hp2 = null;
        this.hp3 = null;
        this.worldX = 800;
        this.worldY = 600;
        this.leftGoals = 0;
        this.rightGoals = 0;
        this.weapon = null;
    }

    preload () {
        // Load in images and sprites
        let basePlayerFolder = 'assets/images/sprites/tds-player-sprites/Characters/PNG_Bodyparts&Animations/PNG_Animations/Man/Walk_gun';
        let baseZombie3Folder = 'assets/images/sprites/Zombies/PNGAnimations/1LVL/Zombie3_male/Walk/';

        this.load.image('bullet', 'assets/images/sprites/bullet6.png');
        this.load.image('target', 'assets/images/demoscene/ball.png');
        this.load.image('background', 'assets/images/skies/underwater1.png');
        this.load.image('gunfire', 'assets/images/sprites/fire1_01.png');
        this.load.audio('pistol', 'assets/sounds/pistol.mp3');
        this.load.audio('shotgun', 'assets/sounds/shotgun.mp3');
        this.load.scenePlugin('WeaponPlugin', '../node_modules/phaser3-weapon-plugin/dist/WeaponPlugin.js', null, 'weapons');

        // Set world bounds
        this.physics.world.setBounds(0, 0, this.worldX, this.worldY);

        // Player sprite sheet - walking with gun
        // First load the player
        this.load.image('player_handgun', basePlayerFolder + '/Walk_gun_000.png');

        // Next load the sprite sheet
        // #TODO Not sure if we want the first frame of this sprite sheet to be the player so I am leaving it
        // as loading twice for now!!!
        this.load.image('walk_gun0', basePlayerFolder + '/Walk_gun_000.png');
        this.load.image('walk_gun1', basePlayerFolder + '/Walk_gun_001.png');
        this.load.image('walk_gun2', basePlayerFolder + '/Walk_gun_002.png');
        this.load.image('walk_gun3', basePlayerFolder + '/Walk_gun_003.png');
        this.load.image('walk_gun4', basePlayerFolder + '/Walk_gun_004.png');
        this.load.image('walk_gun5', basePlayerFolder + '/Walk_gun_005.png');

        // Load zombie 3 male sprites
        this.load.image('zombie3_walk0', baseZombie3Folder + 'walk_000.png');
        this.load.image('zombie3_walk1', baseZombie3Folder + 'walk_001.png');
        this.load.image('zombie3_walk2', baseZombie3Folder + 'walk_002.png');
        this.load.image('zombie3_walk3', baseZombie3Folder + 'walk_003.png');
        this.load.image('zombie3_walk4', baseZombie3Folder + 'walk_004.png');
        this.load.image('zombie3_walk5', baseZombie3Folder + 'walk_005.png');
        this.load.image('zombie3_walk6', baseZombie3Folder + 'walk_006.png');
        this.load.image('zombie3_walk7', baseZombie3Folder + 'walk_007.png');
        this.load.image('zombie3_walk8', baseZombie3Folder + 'walk_008.png');
    }
    create () {
        // create animations
        this.createAnimations();

        // Set world bounds
        this.physics.world.setBounds(0, 0, this.worldX, this.worldY);

        // Add 2 groups for Bullet objects
        this.playerBullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        // Add background player, reticle, healthpoint sprites
        let background = this.add.image(10, 10, 'background');

        this.player = new Player(this, 400, 300, 'player_handgun');

        // Set image/sprite properties
        background.setOrigin(0.5, 0.5).setDisplaySize(this.worldX, this.worldY);

        //  Creates 30 bullets, using the 'bullet' graphic
        this.weapon = this.weapons.add(30, 'bullet');
        console.log(this.weapon);
        this.weapon.debugPhysics = true;
        this.weapon.bulletKillType = WeaponPlugin.consts.KILL_WORLD_BOUNDS;
        this.weapon.bulletLifespan = 500;

        //  The speed at which the bullet is fired
        this.weapon.bulletSpeed = 600;

        //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
        this.weapon.fireRate = 100;

        // Add 2 groups for Bullet objects
        this.enemyBullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true
        });

        this.physics.add.existing(this.player);
        this.weapon.trackSprite(this.player, 0, 0, true);

        // create a list and spawner for enemies
        this.enemies = [];

        let spawnerOptions = {
            lowerInterval: 2500,
            upperInterval: 5000,
            enabled: true,
            maxObjects: 3
        };

        let spawnOptions = { collisionTarget: this.player };

        this.enemySpawner = new Spawner(Enemy, this.enemies, this, 150, 300, 'zombie3_walk0', spawnerOptions, spawnOptions);

        this.ball = new Ball(this, 550, 600, 'target');

        this.reticle = new Reticle(this, 400, 300, 'target');
        this.hp1 = this.add.image(-350, -250, 'target').setScrollFactor(0.5, 0.5);
        this.hp2 = this.add.image(-300, -250, 'target').setScrollFactor(0.5, 0.5);
        this.hp3 = this.add.image(-250, -250, 'target').setScrollFactor(0.5, 0.5);

        // Set image/sprite properties
        background.setOrigin(0, 0).setDisplaySize(this.worldX, this.worldY);

        this.ball.setOrigin(0.5, 0.5).setScale(1.5).setCollideWorldBounds(true).setDrag(10, 10);
        this.player.setOrigin(0.5, 0.5).setScale(0.15).setCollideWorldBounds(true).setDrag(500, 500);
        this.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);
        this.hp1.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        this.hp2.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        this.hp3.setOrigin(0.5, 0.5).setDisplaySize(50, 50);

        // Set sprite variables
        this.player.health = 3;

        // Set camera properties
        // this line is the reason our 800*600 field takes up 1/4 of the 800*600 viewport
        // i think we'd be better off with this at 0 and leaving some space at the top of the view port for info
        // this.physics.world.setBounds(0, 50, this.worldX, this.worldY);
        // or something
        this.cameras.main.zoom = 1;

        // this.cameras.main.startFollow(this.player);

        // Fires bullet from player on left click of mouse
        // this.player.bulletFireSetup();

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
    }

    update (time, delta) {
        let scene = this;

        // Check for bullet collision with ball
        this.physics.add.overlap(this.ball, this.weapon.bullets, this.ball.ballHitCallback, null, this);

        // Rotates player to face towards reticle
        this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);

        // animate the player if they are moving
        // stop the animation when they aren't
        if (this.player.body.acceleration.x !== 0 || this.player.body.acceleration.y !== 0) {
            this.player.walkWithGun(true);
        }
        else {
            this.player.walkWithGun(false);
        }

        // Make reticle move with player
        this.reticle.body.velocity.x = this.player.body.velocity.x;
        this.reticle.body.velocity.y = this.player.body.velocity.y;

        if (this.input.activePointer.isDown) {
            this.weapon.fire();
        }

        // Constrain velocity of player
        this.constrainVelocity(this.player, 500);

        this.enemies.forEach(enemy => {
            enemy.update(this.player, time, scene);
        });
        this.checkGoal();

        this.enemySpawner.spawn(time);
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
        this.ball.setX(400);
        this.ball.setY(300);
    }

    // Create all animations for our scene here for now.
    createAnimations () {
        // Player Walking with gun
        this.anims.create({
            key: 'player_walk_gun',
            frames: [ { key: 'walk_gun0' },
                { key: 'walk_gun1' },
                { key: 'walk_gun2' },
                { key: 'walk_gun3' },
                { key: 'walk_gun4' },
                { key: 'walk_gun5' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Zombie 3 walking
        this.anims.create({
            key: 'zombie3_walk',
            frames: [ { key: 'zombie3_walk0' },
                { key: 'zombie3_walk1' },
                { key: 'zombie3_walk2' },
                { key: 'zombie3_walk3' },
                { key: 'zombie3_walk4' },
                { key: 'zombie3_walk5' },
                { key: 'zombie3_walk6' },
                { key: 'zombie3_walk7' },
                { key: 'zombie3_walk8' }
            ],
            frameRate: 8,
            repeat: -1
        });
    }
}

export default GameScene;
