/**
 * Base class for an enemy
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        // this guy is shaped more like a rectangle, but Aracde bodies don't rotate
        // on the other hand, two circle bodies seem to get stuck to each other when they touch each other 
        // so lets do squares, even though that is not ideal
        this.body.setSize(300, 300);

        this.scene = scene;
        this.lastFired = 0;
        this.dead = false;
        this.immovable = true;
        this.on('animationcomplete', this.animationComplete, this);

        scene.physics.add.collider(this, scene.ball, null, null, scene);
        scene.physics.add.overlap(this, scene.player, this.playerHitCallback, null, scene);
        scene.physics.add.overlap(this, scene.weapon.bullets, this.enemyHitCallback, null, scene);
        scene.physics.add.collider(this, scene.enemies, this.enemyOverlapEnemyCallback, null, scene);
    }

    moveToTarget (target) {
        // console.log('moving towards: ' + target);
        let speed = 150;
        let direction = Math.atan((target.x - this.x) / (target.y - this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y) {
            this.body.setVelocityX(speed * Math.sin(direction));
            this.body.setVelocityY(speed * Math.cos(direction));
        }
        else {
            this.body.setVelocityX(-speed * Math.sin(direction));
            this.body.setVelocityY(-speed * Math.cos(direction));
        }
    }

    static spawn (options, scene, x, y, texture, frame) {
        let enemy = new Enemy(scene, x, y, texture, frame);
        
        enemy.setOrigin(0.5, 0.5).setScale(0.15).setCollideWorldBounds(true);

        enemy.health = options.health || 3;

        if (options.collisionTarget) {
            scene.physics.add.collider(options.collisionTarget, enemy);
        }
        
        scene.zombiegrunt.play();
        return enemy;
    }

    playerHitCallback(enemy, player) {
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
    
    enemyHitCallback (enemyHit, bulletHit) {
        // lower the hp of the enemy
        if (enemyHit.active === true) {
            enemyHit.health -= 1;
        }

        bulletHit.kill();

        if (enemyHit.health <= 0) {
            enemyHit.dead = true;
            this.scene.scene.updateScore(1);
            enemyHit.scene.spawnHeart(enemyHit.x, enemyHit.y);
        }

        // play the bullet hit sound
        enemyHit.scene.fleshwound.play();
    }

    enemyOverlapEnemyCallback (enemy1, enemy2) {
        // Don't need to do anything here it seems with immovable set
        // should be calculate distance between this one and others:
        // check if distance < desiredSeperation
        // if true, get normailsed distance set distance = distance * desired * smoothingValue
        // enem1.x += distance.x, enemy1.y +=distance.y AND enemy2.x -= distance.x enemy2.y -= distance.y
        let desiredSeperation = 2;
        let smoothingValue = 0.2;

        let distance = Math.sqrt(Math.pow(enemy1.x - enemy2.x, 2) + Math.pow(enemy1.y - enemy2.y, 2))
        if (distance < desiredSeperation) {
            let normDist = distance / 2; // don't think this is right
            enemy1.x += normDist * smoothingValue * distance;
            enemy1.y += normDist * smoothingValue * distance;
            
            enemy1.x -= normDist * smoothingValue * distance;
            enemy1.y -= normDist * smoothingValue * distance;
        }        
    }

    update (target, time, scene) {
        // Rotates enemy to face towards target
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);

        // Make enemy fire
        if (this.active && this.dead === false) {
            this.moveToTarget(target);
            this.anims.play('zombie3_walk', true);
        }

        if (this.dead === true) {
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            this.anims.play('zombie3_death', true);
        }


    }

    // This method is called whenver an animation is ended for an enemy.
    animationComplete (animation, frame, sprite) {
        if (animation.key === 'zombie3_death') {
            this.dead = false;
            this.setActive(false).setVisible(false);
            this.destroyed = true;
            this.destroy();
        }
    }
}

export default Enemy;
