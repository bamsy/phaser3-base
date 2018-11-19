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
        
        enemy.setOrigin(0.5, 0.5).setDisplaySize(167.33, 170.33).setCollideWorldBounds(true);

        enemy.health = options.health || 3;

        if (options.collisionTarget) {
            scene.physics.add.collider(options.collisionTarget, enemy);
        }
        
        return enemy;
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
            this.anims.play('zombie3_walk', true);
        }
    }
}

export default Enemy;
