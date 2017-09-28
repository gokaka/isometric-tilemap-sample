/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import '../vendor/phaser-plugin-isometric';

var isoGroup, cursorPos, cursor;

export default class extends Phaser.State {
  
  init () {}
  preload () {
    game.load.json('map', 'assets/maps/iso-map.json');
  }

  create () {
    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    this.game.add.existing(this.mushroom)
    
    this.game.add.sprite(0,0, 'star');


    // Create a group for our tiles.
   isoGroup = this.game.add.group();

   this.spawnTiles();

    // Provide a 3D position for the cursor
    cursorPos = new Phaser.Plugin.Isometric.Point3();
  }

  update () {
    // Update the cursor position.
    // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
    // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
    game.iso.unproject(game.input.activePointer.position, cursorPos);

    // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
    isoGroup.forEach(function (tile) {
        var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
        // If it does, do a little animation and tint change.
        if (!tile.selected && inBounds) {
            tile.selected = true;
            tile.tint = 0x86bfda;
            game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
        // If not, revert back to how it was.
        else if (tile.selected && !inBounds) {
            tile.selected = false;
            tile.tint = 0xffffff;
            game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
    });
  }

  spawnTiles () {
    var mapJSON = game.cache.getJSON('map');
    console.log(mapJSON);

    var tile;
    var data = mapJSON.layers[0].data;
    var width = mapJSON.layers[0].width;
    var height = mapJSON.layers[0].height;
    for(var y=0; y < height; y++){
      for(var x=0; x < width; x++){
        var tileData = data[width*y + x];
        var tileName = (tileData == 1) ? 'tile' : 'tile-attack';
        tile = this.game.add.isoSprite(x * 38, y * 38, 0, tileName, 0, isoGroup);
        tile.anchor.set(0.5, 0);
      }
    }

    // var tile;
    // for (var xx = 0; xx < 256; xx += 38) {
    //   for (var yy = 0; yy < 256; yy += 38) {
    //     // Create a tile using the new game.add.isoSprite factory method at the specified position.
    //     // The last parameter is the group you want to add it to (just like game.add.sprite)
    //     tile = this.game.add.isoSprite(xx, yy, 0, 'tile', 0, isoGroup);
    //     tile.anchor.set(0.5, 0);
    //   }
    // }
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
