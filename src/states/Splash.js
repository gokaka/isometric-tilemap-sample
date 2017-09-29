import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import '../vendor/phaser-plugin-isometric';

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom-green', 'assets/images/mushroom-green.png');
    this.load.image('mushroom-red', 'assets/images/mushroom-red.png');

    this.load.image('star', './assets/images/star.png');

    this.game.load.image('tile-grey', './assets/images/tile-grey.png');
    this.game.load.image('tile-white', './assets/images/tile-white.png');
    this.game.load.image('tile-red', './assets/images/tile-red.png');
    // Add and enable the plug-in.
    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));
    // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
    // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
    this.game.iso.anchor.setTo(0.4, 0.2);


    // load buttons
    game.load.spritesheet('button', './assets/buttons/button.jpg', 100, 50);
  }

  create () {
    this.state.start('Game')
  }
}
