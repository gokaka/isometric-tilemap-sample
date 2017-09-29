import Phaser from 'phaser';
import BattleScene from '../scene/BattleScene';

export default class extends Phaser.Sprite {
  constructor ({ game, mapX, mapY, asset, isoGroup }) {
    var pos = BattleScene.getPos(mapX, mapY, isoGroup);
    super(game, pos.x, pos.y, asset);
    this.z = pos.z;
    this.anchor.setTo(0.5);
    this.mapX = mapX;
    this.mapY = mapY;
  }

  update () {
    // this.angle += 1
  }
}
