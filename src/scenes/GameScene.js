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
        // Load in images and sprites
        let basePlayerFolder = 'assets/images/sprites/tds-player-sprites/Characters/PNG_Bodyparts&Animations/PNG_Animations/Man/Walk_gun';
        let basePlayerDeathFolder = 'assets/images/sprites/tds-player-sprites/Characters/PNG_Bodyparts&Animations/PNG_Animations/Man/Death/';
        let baseZombie3Folder = 'assets/images/sprites/Zombies/PNGAnimations/1LVL/Zombie3_male/Walk/';
        let basePistolShotFolder = 'assets/images/sprites/tds-player-sprites/Characters/PNG_Bodyparts&Animations/PNG_Animations/Man/Gun_Shot';
        let baseZombie3DeathFolder = 'assets/images/sprites/Zombies/PNGAnimations/1LVL/Zombie3_male/Death/';

        //https://opengameart.org/content/soccer-ball
        this.load.image('ball', 'assets/images/sprites/SoccerBall.png');
        this.load.image('bullet', 'assets/images/sprites/bullet6.png');
        this.load.image('target', 'assets/images/demoscene/ball.png');
        this.load.image('background', 'assets/images/soccerfield.png');
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

        // Load Pistol Gunshot animation
        this.load.image('pistol_shot0', basePistolShotFolder + '/Gun_Shot_000.png');
        this.load.image('pistol_shot1', basePistolShotFolder + '/Gun_Shot_001.png');
        this.load.image('pistol_shot2', basePistolShotFolder + '/Gun_Shot_002.png');
        this.load.image('pistol_shot3', basePistolShotFolder + '/Gun_Shot_003.png');
        this.load.image('pistol_shot4', basePistolShotFolder + '/Gun_Shot_004.png');

        // Load Player Death Animation
        this.load.image('player_death0', basePlayerDeathFolder + 'death_0000_Man.png');
        this.load.image('player_death1', basePlayerDeathFolder + 'death_0001_Man.png');
        this.load.image('player_death2', basePlayerDeathFolder + 'death_0002_Man.png');
        this.load.image('player_death3', basePlayerDeathFolder + 'death_0003_Man.png');
        this.load.image('player_death4', basePlayerDeathFolder + 'death_0004_Man.png');
        this.load.image('player_death5', basePlayerDeathFolder + 'death_0005_Man.png');

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

        // Load zombie 3 death
        this.load.image('zombie3_death0', baseZombie3DeathFolder + 'Death_000.png');
        this.load.image('zombie3_death1', baseZombie3DeathFolder + 'Death_001.png');
        this.load.image('zombie3_death2', baseZombie3DeathFolder + 'Death_002.png');
        this.load.image('zombie3_death3', baseZombie3DeathFolder + 'Death_003.png');
        this.load.image('zombie3_death4', baseZombie3DeathFolder + 'Death_004.png');
        this.load.image('zombie3_death5', baseZombie3DeathFolder + 'Death_005.png');
    }
    create () {
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

        this.player = new Player(this, 400, 300, 'player_handgun');
        this.player.createHealthBar(this.game);

        // create animations
        this.createAnimations();

        // Bullet class
        // this.gunBullet = new Bullet(this);

        //  Creates 30 bullets, using the 'bullet' graphic
        this.weapon = this.weapons.add(30, 'bullet');

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
            maxObjects: 3
        };

        let spawnOptions = {
            collisionTarget: this.player
        };

        this.enemySpawner = new Spawner(Enemy, this.enemies, this, 150, 300, 'zombie3_walk0', spawnerOptions, spawnOptions);

        this.ball = new Ball(this, 400, 300, 'ball');

        this.physics.add.collider(this.player, this.ball);

        this.reticle = new Reticle(this, 400, 300, 'target');


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
            console.log('RIGHT SCORE! ' + this.rightGoals);
        }

        this.ball.setX(400);
        this.ball.setY(300);

        // the ball will tend to roll a bit more left/right than up/down
        this.ball.body.setVelocity((Math.random()-0.5)*200, (Math.random()-0.5)*100);
    }

    // Create all animations for our scene here for now.
    createAnimations () {
        // Player Walking with gun
        this.anims.create({
            key: 'player_walk_gun',
            frames: [{
                    key: 'walk_gun0'
                },
                {
                    key: 'walk_gun1'
                },
                {
                    key: 'walk_gun2'
                },
                {
                    key: 'walk_gun3'
                },
                {
                    key: 'walk_gun4'
                },
                {
                    key: 'walk_gun5'
                }
            ],
            frameRate: 8,
            repeat: 0
        });

        // Pistol Shot Animation
        this.anims.create({
            key: 'player_pistol_shot',
            frames: [{
                    key: 'pistol_shot0'
                },
                {
                    key: 'pistol_shot1'
                },
                {
                    key: 'pistol_shot2'
                },
                {
                    key: 'pistol_shot3'
                },
                {
                    key: 'pistol_shot4'
                }
            ],
            frameRate: 8,
            repeat: 0
        });

        // Player Death Animation
        this.anims.create({
            key: 'player_death',
            frames: [{
                    key: 'player_death0'
                },
                {
                    key: 'player_death1'
                },
                {
                    key: 'player_death2'
                },
                {
                    key: 'player_death3'
                },
                {
                    key: 'player_death4'
                },
                {
                    key: 'player_death5'
                }
            ],
            frameRate: 8,
            repeat: 0
        });

        // Zombie 3 walking
        this.anims.create({
            key: 'zombie3_walk',
            frames: [{
                    key: 'zombie3_walk0'
                },
                {
                    key: 'zombie3_walk1'
                },
                {
                    key: 'zombie3_walk2'
                },
                {
                    key: 'zombie3_walk3'
                },
                {
                    key: 'zombie3_walk4'
                },
                {
                    key: 'zombie3_walk5'
                },
                {
                    key: 'zombie3_walk6'
                },
                {
                    key: 'zombie3_walk7'
                },
                {
                    key: 'zombie3_walk8'
                }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Zombie 3 Death zombie3_death0
        this.anims.create({
            key: 'zombie3_death',
            frames: [{
                    key: 'zombie3_death0'
                },
                {
                    key: 'zombie3_death1'
                },
                {
                    key: 'zombie3_death2'
                },
                {
                    key: 'zombie3_death3'
                },
                {
                    key: 'zombie3_death4'
                },
                {
                    key: 'zombie3_death5'
                }
            ],
            frameRate: 8,
            repeat: 0
        });
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
