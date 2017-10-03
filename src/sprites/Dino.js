import Phaser from 'phaser';
import BattleScene from '../scene/BattleScene';
import DinoState from './DinoState';

export default class extends Phaser.Sprite {
  constructor ({ game, mapX, mapY, asset, isoGroup }) {
    var pos = BattleScene.getPos(mapX, mapY, isoGroup);
    super(game, pos.x, pos.y, asset);
    this.isoGroup = isoGroup;
    this.z = pos.z;
    this.anchor.setTo(0.5);
    this.mapX = mapX;
    this.mapY = mapY;

    // add animations
    this.animations.add('idle', [0,1,2,3], 7, true);
    this.animations.add('move', [4,5,6,7,8.9], 7, true);
    this.animations.add('attack', [2, 6, 7, 2], 5, false);
    var hurtAnim = this.animations.add('hurt', [10,11,12,13], 7, false);
    hurtAnim.onComplete.add(() => {this.idleAnimation();}, this);

    this.state = DinoState.IDLE;
    this.idleAnimation();
  }

  update () {
    // this.angle += 1
  }

  idleAnimation(){
    this.animations.play('idle');
  }

  moveAnimation(){
    this.animations.play('move');
  }

  attackAnimation(){
    this.animations.play('attack');
  }

  hurtAnimation() {
    this.animations.play('hurt');
  }

  outAttackRange(obj){
    if(Math.abs(this.mapX - obj.mapX) <= 3 && Math.abs(this.mapY - obj.mapY) <= 3){
      return false;
    }
    return true;
  }

  moveDistance(delta){
    var maxMoveDistance = 3;
    delta = delta > maxMoveDistance ? maxMoveDistance : (delta - 1);
    delta = delta < -maxMoveDistance ? -maxMoveDistance : (delta + 1);
    return delta;
  }

  randPos(x){
    var randX = (Math.random()*10%2 > 1) ? 1 : -1 ;
    return x + randX;
  }

  moveTo(obj){
    var deltaX = obj.mapX - this.mapX;
    var deltaY = obj.mapY - this.mapY;
    console.log(`${deltaX}, ${deltaY}`);
    deltaX = this.moveDistance(deltaX);
    deltaY = this.moveDistance(deltaY);

    this.moveAnimation();
    var mapX = this.mapX + deltaX;
    var mapY = this.mapY + deltaY;
    console.log(`move to ${mapX}, ${mapY}`);
    if(mapX == obj.mapX){
      mapX = this.randPos(mapX);
    }
    if(mapY == obj.mapY){
      mapY = this.randPos(mapY);
    }

    var mapXY = BattleScene.getPosInMap(mapX, mapY);
    this.mapX = mapXY.mapX;
    this.mapY = mapXY.mapY;
    console.log(`move to ${this.mapX}, ${this.mapY}`);
    
    var tile = BattleScene.getPos(this.mapX, this.mapY, this.isoGroup);
    var moveTo = game.add.tween(this).to({x: tile.x, y: tile.y, z: tile.z}, 800, Phaser.Easing.Quadratic.InOut, true);
    moveTo.onComplete.add(() => { 
      this.idleAnimation();
    });
  }
  
  attack(obj){
    if(this.outAttackRange(obj)) {
      this.moveTo(obj);
      return;
    }
    this.moveAnimation();
    var moveTo = game.add.tween(this).to({x: obj.x-25, y: obj.y+10}, 500, Phaser.Easing.Quadratic.InOut);
    var attackStart = game.add.tween(this).to({y: "-10", tint: 0xff0000}, 300, Phaser.Easing.Bounce.In);
    var attackEnd = game.add.tween(this).to({y: "+10", tint: 0xffffff}, 300, Phaser.Easing.Bounce.Out);
    
    var moveBack = game.add.tween(this).to({x: this.x, y: this.y}, 500, Phaser.Easing.Quadratic.InOut);
    moveTo.onComplete.add(() => { 
      attackStart.start(); 
      this.attackAnimation();
    } );
    attackStart.onComplete.add(() => { 
      attackEnd.start();
      obj.hurtAnimation();
    } );
    attackEnd.onComplete.add(() => {
      this.moveAnimation();
      moveBack.start();
    });
    moveBack.onComplete.add(() => {
      this.idleAnimation();
    });
    moveTo.start();
  }
}
