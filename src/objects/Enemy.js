import { addCollisions } from '../common/Utilities';

/**
 * Base class for an enemy
 */
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.scene = scene;
        this.lastFired = 0;
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
        
        enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true);

        enemy.health = options.health || 3;

        if (options.collisionTarget) {
            scene.physics.add.collider(options.collisionTarget, enemy);
        }
        
        return enemy;
    }

    enemyFire (target, time, scene) {
        if (this.active === false) {
            return;
        }

        if ((time - this.lastFired) > 1000) {
            this.lastFired = time;

            // Get bullet from bullets group
            var bullet = this.scene.enemyBullets.get().setActive(true).setVisible(true);

            if (bullet) {
                bullet.fire(this, target);

                // add collisions
                let collisionObjects = [
                    {
                        target: scene.player,
                        callback: scene.player.playerHitCallback
                    },
                    {
                        target: scene.ball,
                        callback: scene.ball.ballHitCallback
                    }
                ];

                addCollisions(collisionObjects);
            }
        }
    }

    enemyHitCallback (enemy, bulletHit) {
        // Reduce health of enemy
        if (bulletHit.active === true && enemy.active === true) {
            enemy.health -= 1;
            console.log('Enemy hp: ', enemy.health);

            // Destroy bullet
            bulletHit.setActive(false).setVisible(false);

            // Kill enemy if health <= 0
            if (enemy.health <= 0) {
                enemy.setActive(false).setVisible(false);

                // mark for removal
                enemy.destroyed = true;

                // eco friendly
                enemy.destroy();
            }
        }
    }

    update (target, time) {
        // Rotates enemy to face towards target
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);

        // Make enemy fire
        if (this.active) {
            this.moveToTarget(target);
        }

        this.enemyFire(target, time, this.scene);
    }
}

export default Enemy;
