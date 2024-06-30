class CoordAndGameObject {
  constructor(x, y, gameObj) {
    this.x = x;
    this.y = y;
    this.gameObj = gameObj;
  }
}


class GameObjectIterator {
  constructor(pythonLayer) {
    this.pythonLayer = pythonLayer;
  }
  // Syntaxe dégueue avec une étoile, pour dire qu'on veut faire un itérateur.
  // https://stackoverflow.com/questions/39197811/how-can-i-write-a-generator-in-a-javascript-class
  * iterOnGameObjects(multiplicatorX, multiplicatorY) {}
}


export class GameObjectIteratorDense extends GameObjectIterator {
  constructor(pythonLayer) {
    super(pythonLayer);
  }
  * iterOnGameObjects(multiplicatorX, multiplicatorY) {
    let currentX = 0;
    let currentY = 0;
    for (let lineTile of this.pythonLayer.tiles) {
      for (let tile of lineTile) {
        for (let gameObj of tile.game_objects) {
          yield new CoordAndGameObject(currentX, currentY, gameObj);
        }
        currentX += multiplicatorX;
      }
      currentX = 0;
      currentY += multiplicatorY;
    }
  }
}


export class GameObjectIteratorSparse extends GameObjectIterator {
  constructor(pythonLayer) {
    super(pythonLayer);
  }
  * iterOnGameObjects(multiplicatorX, multiplicatorY) {
    for (let gameObj of this.pythonLayer.game_objects) {
      yield new CoordAndGameObject(
        gameObj._coord.x * multiplicatorX,
        gameObj._coord.y * multiplicatorY,
        gameObj
      );
    }
  }
}
