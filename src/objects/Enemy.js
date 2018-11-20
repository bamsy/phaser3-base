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
    
    enemyHitCallback (enemyHit, bulletHit) {
        // lower the hp of the enemy
        if (enemyHit.active === true) {
            enemyHit.health -= 1;
        }

        bulletHit.kill();

        if (enemyHit.health <= 0) {
            enemyHit.setActive(false).setVisible(false);
            enemyHit.destroyed = true;
            enemyHit.destroy();
        }
    }

    update (target, time, scene) {
        // Rotates enemy to face towards target
        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);

        // Make enemy fire
        if (this.active) {
            this.moveToTarget(target);
            this.anims.play('zombie3_walk', true);
        }

        scene.physics.add.overlap(this, scene.weapon.bullets, this.enemyHitCallback, null, scene);
    }
}

export default Enemy;
