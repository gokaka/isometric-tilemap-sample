/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom';
import Dino from '../sprites/Dino';
import DinoState from '../sprites/DinoState';
import LabelButton from '../sprites/LabelButton';
import BattleScene from '../scene/BattleScene';
import BattleState from '../scene/BattleState';
import '../vendor/phaser-plugin-isometric';

var isoGroup, cursorPos, cursor;
var player, playerMove, enemy;
var dino;
var map = {};
var battleScene;

export default class extends Phaser.State {

  loadMap () {
    var mapJSON = game.cache.getJSON('map');
    var data = mapJSON.layers[0].data;
    var width = mapJSON.layers[0].width;
    var height = mapJSON.layers[0].height;
    map.width = width;
    map.height = height;
    map.data = data;
    map.tileSize = BattleScene.tileSize;
  }
  
  init () {
    // init global
    this.game.global= {
      battleScene: BattleScene
    };
    battleScene = this.game.global.battleScene;
  }

  preload () {
    game.load.json('map', 'assets/maps/iso-map.json');
  }

  create () {
    // const bannerText = 'Phaser + ES6 + Webpack'
    // let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    // banner.font = 'Bangers'
    // banner.padding.set(10, 16)
    // banner.fontSize = 40
    // banner.fill = '#77BFA3'
    // banner.smoothed = false
    // banner.anchor.setTo(0.5)

    // load spriteSheet dino
    // dino = game.add.sprite(109, 100, 'dino');
    // dino.animations.add('idle', [0,1,2,3], 7, true);
    // dino.animations.add('move', [4,5,6,7,8,9], 7, true);
    // dino.animations.play('idle');
    // console.log(dino);

    this.loadMap();
    
    // Create a group for our tiles.
    isoGroup = this.game.add.group();
    this.spawnTiles();
    
    // Provide a 3D position for the cursor
    cursorPos = new Phaser.Plugin.Isometric.Point3();
    
    console.log(isoGroup);

    player = new Dino({
      game: this.game,
      mapX: battleScene.playerSpawn.x,
      mapY: battleScene.playerSpawn.y,
      asset: 'dino_vita',
      isoGroup: isoGroup
    });
    this.game.add.existing(player);
    player.idleAnimation();
    console.log(player);

    playerMove = new Dino({
      game: this.game,
      mapX: battleScene.playerSpawn.x,
      mapY: battleScene.playerSpawn.y,
      asset: 'dino_vita',
      isoGroup: isoGroup
    });
    playerMove.visible = false;
    playerMove.alpha = 0.5;
    this.game.add.existing(playerMove);

    enemy = new Dino({
      game: this.game,
      mapX: battleScene.enemySpawn.x,
      mapY: battleScene.enemySpawn.y,
      asset: 'dino_mort',
      isoGroup: isoGroup
    });

    this.game.add.existing(enemy);


    // add buttons

    var idleButton = game.add.button(this.world.centerX, 0, 'button', this.switchIdleState, this, 2, 1, 0);
    var idleText = game.add.text(0, 0, "Idle", {font: "16px", fill: "#000"});
    idleButton.addChild(idleText);


    var moveButton = game.add.button(this.world.centerX+120, 0, 'button', this.switchMoveState, this, 2, 1, 0);
    var moveText = game.add.text(0, 0, "Move", {font: "16px", fill: "#000"});
    moveButton.addChild(moveText);

    var attackButton = game.add.button(this.world.centerX+240, 0, 'button', this.switchAttackState, this, 2, 1, 0);
    var attackText = game.add.text(0, 0, "Attack", {font: "16px", fill: "#000"});
    attackButton.addChild(attackText);

    var enemyButton = game.add.button(this.world.width-100, this.world.height-60, 'button', this.enemyTurn, this, 2, 1, 0);
    var enemyText = game.add.text(0, 0, "Enemy Turn", {font: "16px", fill: "#000"});
    enemyButton.addChild(enemyText);

    this.moveKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    this.attackKey = game.input.keyboard.addKey(Phaser.Keyboard.A);

  }
  
  enemyTurn(){
    battleScene.state = BattleState.ENEMY_TURN;
    enemy.attack(player);
  }

  switchIdleState() {
    battleScene.state = BattleState.IDLE;
    console.log(battleScene.state);
  }

  switchMoveState(){
    battleScene.state = BattleState.MOVE;
    console.log(battleScene.state);
  }

  switchAttackState(){
    battleScene.state = BattleState.ATTACK;
    console.log(battleScene.state);
  }

  actionOnClick() {
    alert('action on click');
  }

  update () {
    if(battleScene.BattleState == BattleState.MOVE){
      
    }
    else if(player.state == DinoState.IDLE){
      
    }
    

    if(this.moveKey.isDown){
      this.switchMoveState();
    }
    if(this.attackKey.isDown){
      this.switchAttackState();
    }

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
            // player.position = tile.position;
            // console.log(tile);
        }
        // If not, revert back to how it was.
        else if (tile.selected && !inBounds) {
            tile.selected = false;
            tile.tint = 0xffffff;
            game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }


        if(battleScene.state == BattleState.MOVE){
          if(battleScene.playerMove(player.mapX, player.mapY, enemy.mapX, enemy.mapY, tile.mapX, tile.mapY)){
            tile.tint = 0x86bfda;
            if(tile.selected){
              playerMove.position = tile.position;
              playerMove.visible = true;
              if(game.input.activePointer.isDown){
                console.log(tile);
                playerMove.visible = false;
                player.moveAnimation();
                battleScene.state = BattleState.IDLE;
                player.mapX = tile.mapX;
                player.mapY = tile.mapY;
                console.log(`player move ${player.mapX}, ${player.mapY}`);

                function bringTop(){
                  if(player.mapX > enemy.mapX || player.mapY > enemy.mapY){
                    game.world.bringToTop(player);
                  }
                  else {
                    game.world.bringToTop(enemy);
                  }
                }
                bringTop();
                var moveTo = game.add.tween(player).to({x: tile.x, y: tile.y, z: tile.z}, 800, Phaser.Easing.Quadratic.InOut, true);
                moveTo.onComplete.add(function(){ 
                  console.log('move to end');
                  // player.animations.stop();
                  player.idleAnimation();
                } );
              }
            }
          }

          else{
            tile.tint = 0xffffff;
          }
        }
        
        if(battleScene.state == BattleState.ATTACK){
          if(battleScene.playerAttack(player.mapX, player.mapY, tile.mapX, tile.mapY)){
            tile.tint = 0xda8686;

            if(tile.selected){
              playerMove.position = tile.position;
              playerMove.visible = true;

              if(game.input.activePointer.isDown){
                console.log(tile);
                playerMove.visible = false;
                battleScene.state = BattleState.IDLE;
                player.moveAnimation();
                var moveTo = game.add.tween(player).to({x: tile.x-25, y: tile.y+10}, 500, Phaser.Easing.Quadratic.InOut);
                var attackStart = game.add.tween(player).to({y: "-10", tint: 0xff0000}, 300, Phaser.Easing.Bounce.In);
                var attackEnd = game.add.tween(player).to({y: "+10", tint: 0xffffff}, 300, Phaser.Easing.Bounce.Out);
                
                var moveBack = game.add.tween(player).to({x: player.x, y: player.y}, 500, Phaser.Easing.Quadratic.InOut);
                moveTo.onComplete.add(function(){ 
                  attackStart.start(); 
                  player.attackAnimation();
                } );
                attackStart.onComplete.add(function() { 
                  attackEnd.start();
                  if(enemy.mapX == tile.mapX && enemy.mapY == tile.mapY){
                    enemy.hurtAnimation();
                  }
                } );
                attackEnd.onComplete.add(function(){
                  moveBack.start();
                  player.moveAnimation();
                });
                moveBack.onComplete.add(function() {
                  player.idleAnimation();
                });
                moveTo.start();
              }
            }

            
          }
          else{
            tile.tint = 0xffffff;
          }
        }

        if(battleScene.state == BattleState.IDLE){
          tile.tint = 0xffffff;
          if(playerMove.visible) playerMove.visible = false;
        }
    });
  }

  
  spawnTiles () {
    var tile;
    for(var y=0; y < map.height; y++){
      for(var x=0; x < map.width; x++){
        var tileData = map.data[map.width*y + x];
        var tileName = (tileData == 1) ? 'tile-white' : 'tile-grey';
        tile = this.game.add.isoSprite(x * map.tileSize, y * map.tileSize, 0, tileName, 0, isoGroup);
        tile.anchor.set(0.5, 0);
        tile.mapX = x + 1;
        tile.mapY = y + 1;
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
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
      this.game.debug.text(`Battle State: ${battleScene.state}`, 0, 20);
      this.game.debug.text(`Player: ${player.mapX}, ${player.mapY}`, 0, 40);
      this.game.debug.text(`Enemy: ${enemy.mapX}, ${enemy.mapY}`, 0, 60);
    }

    
    if(battleScene.state == BattleState.MOVE){
      
    }
  }
  
}
