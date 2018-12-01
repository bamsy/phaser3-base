import 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';
import ScoreScene from './scenes/ScoreScene';
import { Plugin as WeaponPlugin } from 'phaser3-weapon-plugin';

var config = {
    type: Phaser.WEBGL,
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
        }

    },
    plugins: { global: [ WeaponPlugin ] },
    scene: [
        BootScene,
        TitleScene,
        GameScene,
        ScoreScene
    ]
};

const game = new Phaser.Game(config);
