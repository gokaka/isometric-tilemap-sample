import Phaser from 'phaser';

export default class extends Phaser.Button {
  constructor(game, x, y, asset, text, callback, callbackContext, tint){
    super(game, x, y, asset, callback, callbackContext, 2, 1, 0, 0);
    var text = new Text(game, 0, 0, text, {font: "20px", fill: "#000"});
    this.addChild(text);
  }
}