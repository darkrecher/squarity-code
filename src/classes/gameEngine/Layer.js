import GameObjectTransitioner from './GameObjectTransitioner.js';
import GameUpdateResult from './GameUpdateResult.js'

class CoordAndGameObject {
  constructor(x, y, gameObj) {
    this.x = x;
    this.y = y;
    this.gameObj = gameObj;
  }
}

// TODO: tout ça dans un autre fichier.

class GameObjectIterator {
  constructor(pythonLayer) {
    this.pythonLayer = pythonLayer;
  }
  // Syntaxe dégueue avec une étoile, pour dire qu'on veut faire un itérateur.
  // https://stackoverflow.com/questions/39197811/how-can-i-write-a-generator-in-a-javascript-class
  * iterOnGameObjects(multiplicatorX, multiplicatorY) {}
}

class GameObjectIteratorDense extends GameObjectIterator {
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

class GameObjectIteratorSparse extends GameObjectIterator {
  constructor(pythonLayer) {
    super(pythonLayer);
  }
  * iterOnGameObjects(multiplicatorX, multiplicatorY) {
    for (let gameObj of this.pythonLayer.game_objects) {
      yield new CoordAndGameObject(
        gameObj.coord.x * multiplicatorX,
        gameObj.coord.y * multiplicatorY,
        gameObj
      );
    }
  }
}


class LayerBase {

  constructor(pythonLayer, gameModel) {
    this.pythonLayer = pythonLayer;
    this.gameModel = gameModel;
    const layerClassName = this.pythonLayer.__class__.toString();
    if (layerClassName.includes("LayerSparse")) {
      this.isLayerSparse = true;
      this.gameObjectIterator = new GameObjectIteratorSparse(this.pythonLayer);
    } else {
      this.isLayerSparse = false;
      this.gameObjectIterator = new GameObjectIteratorDense(this.pythonLayer);
    }
  }

  updateWithGameSituation(timeNow) {}
  updateTransitions(timeNow) {}
  draw(timeNow) {}

}

export class LayerWithTransition extends LayerBase {

  constructor(
    pythonLayer,
    gameModel,
    imgCoords,
    ctxCanvasBuffer,
    tileAtlas,
    tileImgWidth, tileImgHeight,
    tileCanvasWidth, tileCanvasHeight,
  ) {
    super(pythonLayer, gameModel);
    this.imgCoords = imgCoords;
    this.ctxCanvasBuffer = ctxCanvasBuffer;
    this.tileAtlas = tileAtlas;
    this.tileImgWidth = tileImgWidth;
    this.tileImgHeight = tileImgHeight;
    this.tileCanvasWidth = tileCanvasWidth;
    this.tileCanvasHeight = tileCanvasHeight;
    // Le layerMemory est un Map qui contient, pour chaque objet du layer, un GameObjectTransitioner.
    // Ce GameObjectTransitioner contient les transitions en cours pour l'objet, et l'état actuel de l'objet.
    // (Il n'y a pas forcément de transition en cours, mais il faut au moins le GameObjectTransitioner
    // pour l'afficher dans l'aire de jeu).
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    this.layerMemory = new Map();
  }


  updateWithGameSituation(timeNow) {
    // On envoie les addTransitionFromNewState aux objets que y'a dans le layer.
    const timeNowLayerBefore = performance.now();
    let addedAnObject = false;
    let idObjsPresent = new Set();
    let gameUpdateResult = new GameUpdateResult();

    for (let coordAndGameObj of this.gameObjectIterator.iterOnGameObjects(1, 1)) {
      const gameObj = coordAndGameObj.gameObj;
      const gobjId = gameObj._go_id;
      idObjsPresent.add(gobjId);
      let gobjTransitioner;
      let hasNewTransition = false;
      if (!this.layerMemory.has(gobjId)) {
        gobjTransitioner = new GameObjectTransitioner(
          this.gameModel, coordAndGameObj.x, coordAndGameObj.y, gameObj
        );
        this.layerMemory.set(gobjId, gobjTransitioner);
        gameObj._transitioner = gobjTransitioner;
        addedAnObject = true;
      } else {
        gobjTransitioner = this.layerMemory.get(gobjId);
        if (gameObj._must_clear_transitions) {
          gobjTransitioner.clearRecordedTransitions();
        }
        hasNewTransition = gobjTransitioner.addTransitionsFromNewState(
          // TODO : plus besoin de passer gameObj en param.
          coordAndGameObj.x, coordAndGameObj.y, gameObj, timeNow
        );
      }
      if (gameObj._transitions_to_record.length) {
        gobjTransitioner.addTransitionsFromRecords(timeNow);
        hasNewTransition = true;
      }
      if (hasNewTransition) {
        console.log("plock_transi", gameObj.plock_transi);
        gameUpdateResult.hasAnyTransition = true;
        if (gameUpdateResult.PlockTransi < gameObj.plock_transi) {
          console.log("gameUpdateResult.PlockTransi", gameUpdateResult.PlockTransi);
          gameUpdateResult.PlockTransi = gameObj.plock_transi;
          console.log("gameUpdateResult.PlockTransi after", gameUpdateResult.PlockTransi);
        }
      }
    }

    if (addedAnObject || (idObjsPresent.size !== this.layerMemory.size)) {
      // On ne peut plus trop se fier au nombre d'objets précédent et au nombre d'objet courant.
      // Ça veut dire qu'il faut peut-être enlever des objets.
      // Il faut itérer sur les objets dans layerMemory.
      // Si un objet n'est pas dans idObjsPresent, c'est qu'il a disparu.
      const idObjsPrevious = this.layerMemory.keys();
      for (let gobjId of idObjsPrevious) {
        if (!idObjsPresent.has(gobjId)) {
          this.layerMemory.delete(gobjId);
        }
      }
    }
    const timeNowLayerAfter = performance.now();
    return gameUpdateResult;
  }


  updateTransitions(timeNow) {
    const mergedGameUpdateResult = new GameUpdateResult();
    for (let [gobjId, gobjTransitioner] of this.layerMemory) {
      const gameUpdateResult = gobjTransitioner.updateTransitions(timeNow);
      if (gameUpdateResult !== null) {
        mergedGameUpdateResult.merge(gameUpdateResult);
      }
    }
    return mergedGameUpdateResult;
  }


  draw(timeNow) {
    // FUTURE : Éventuellement, mettre en cache l'image du layer en cours, si c'en est un qu'a pas de transitions.
    for (let [gobjId, gobjTransitioner] of this.layerMemory) {
      const gobjState = gobjTransitioner.getCurrentState(timeNow);
      const [coordImgX, coordImgY] = this.imgCoords[gobjState.spriteName];
      this.ctxCanvasBuffer.drawImage(
        this.tileAtlas,
        coordImgX, coordImgY, this.tileImgWidth, this.tileImgHeight,
        gobjState.x * this.tileCanvasWidth, gobjState.y * this.tileCanvasHeight,
        this.tileCanvasWidth, this.tileCanvasHeight,
      );
    }
  }

}


export class LayerNoTransition extends LayerBase{

  constructor(
    pythonLayer,
    gameModel,
    imgCoords,
    ctxCanvasBuffer,
    tileAtlas,
    tileImgWidth, tileImgHeight,
    tileCanvasWidth, tileCanvasHeight,
  ) {
    super(pythonLayer, gameModel);
    this.imgCoords = imgCoords;
    this.ctxCanvasBuffer = ctxCanvasBuffer;
    this.tileAtlas = tileAtlas;
    this.tileImgWidth = tileImgWidth;
    this.tileImgHeight = tileImgHeight;
    this.tileCanvasWidth = tileCanvasWidth;
    this.tileCanvasHeight = tileCanvasHeight;
  }


  updateWithGameSituation(timeNow) {
    return null;
  }


  updateTransitions(timeNow) {
    return null;
  }


  draw(timeNow) {
    for (let coordAndGameObj of this.gameObjectIterator.iterOnGameObjects(
      this.tileCanvasWidth, this.tileCanvasHeight
    )) {
      const [coordImgX, coordImgY] = this.imgCoords[
        coordAndGameObj.gameObj.sprite_name
      ];
      this.ctxCanvasBuffer.drawImage(
        this.tileAtlas,
        coordImgX, coordImgY, this.tileImgWidth, this.tileImgHeight,
        coordAndGameObj.x, coordAndGameObj.y, this.tileCanvasWidth, this.tileCanvasHeight,
      );
    }
  }

}
