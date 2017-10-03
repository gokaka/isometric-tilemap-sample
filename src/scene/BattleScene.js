import BattleState from './BattleState';

export default {
  playerSpawn: {x: 2, y: 8},
  enemySpawn: {x: 6, y: 4},
  tileSize: 38,
  width: 11,
  height: 9,

  state: BattleState.IDLE,

  getPos(mapX, mapY, isoGroup){
    var index = (mapY-1) * this.width + (mapX-1);
    console.log(index);
    var child = isoGroup.children[index];
    return {x: child.x, y: child.y, z: child.z};
  },

  playerMove(playerX, playerY, enemyX, enemyY, mapX, mapY){
    var moveMatrix = [
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
    ];
    var moveX = mapX - playerX + 3;
    var moveY = mapY - playerY + 3;
    var eX = enemyX - playerX + 3;
    var eY = enemyY - playerY + 3;
    try{
      moveMatrix[eY][eX] = 0;
    }
    catch(ex){
    }   
    // for(var j=0; j<=eY; j++){
    //   for(var i=eX; i>=0 && i<moveMatrix[j].length;i++){
    //       moveMatrix[j][i] = 0;
    //   }
    // }

    if(moveX < 0 || moveX >= moveMatrix[0].length) return false;
    if(moveY < 0 || moveY >= moveMatrix.length) return false;

    return moveMatrix[moveY][moveX];
  },

  playerAttack(playerX, playerY, mapX, mapY){
    var matrix = [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ];
    var moveX = mapX - playerX + 2;
    var moveY = mapY - playerY + 2;
    if(moveX < 0 || moveX >= matrix[0].length) return false;
    if(moveY < 0 || moveY >= matrix.length) return false;

    return matrix[moveY][moveX];
  },

  getPosInMap(mapX, mapY){
    if(mapX < 0) mapX = 0;
    if(mapX >= this.width) mapX = this.width-1;

    if(mapY < 0) mapY = 0;
    if(mapY >= this.height) mapY = this.height-1;

    return {mapX: mapX, mapY: mapY};
  }
}