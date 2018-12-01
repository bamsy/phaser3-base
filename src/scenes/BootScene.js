class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });
    }
    preload() {
        const progress = this.add.graphics();

        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        this.load.on('complete', () => {
            progress.destroy();
            this.scene.start('GameScene');
            // this.scene.resume('GameScene');
        });


        // Load font
        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

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
        this.load.image('reticle', 'assets/images/sprites/reticle/Crosshairs_Red.svg');
        this.load.image('background', 'assets/images/soccerfield.png');
        this.load.image('gunfire', 'assets/images/sprites/fire1_01.png');
        this.load.audio('pistol', 'assets/sounds/pistol.mp3');
        this.load.audio('shotgun', 'assets/sounds/shotgun.mp3');
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

        // load audio
        this.load.audio('music', 'assets/sounds/BRPG_Assault_FULL_Loop.wav');
        this.load.audio('gunshot', 'assets/sounds/gun_pistol_shot_01.wav');
        this.load.audio('fleshhit', 'assets/sounds/bullet_impact_body_flesh_01.wav');
        this.load.audio('ballhit', 'assets/sounds/bullet_impact_ball_01.wav');
    }

    create() {
        // create animations
        this.createAnimations();
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
}

export default BootScene;