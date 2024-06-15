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
  constructor(python_layer) {
    this.python_layer = python_layer;
  }
  // Syntaxe dégueue avec une étoile, pour dire qu'on veut faire un itérateur.
  // https://stackoverflow.com/questions/39197811/how-can-i-write-a-generator-in-a-javascript-class
  * iterOnGameObjects(multiplicatorX, multiplicatorY) {}
}

class GameObjectIteratorDense extends GameObjectIterator {
  constructor(python_layer) {
    super(python_layer);
  }
  * iterOnGameObjects(multiplicatorX, multiplicatorY) {
    let currentX = 0;
    let currentY = 0;
    for (let lineTile of this.python_layer.tiles) {
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
  constructor(python_layer) {
    super(python_layer);
  }
  * iterOnGameObjects(multiplicatorX, multiplicatorY) {
    for (let gameObj of this.python_layer.game_objects) {
      yield new CoordAndGameObject(
        gameObj.coord.x * multiplicatorX,
        gameObj.coord.y * multiplicatorY,
        gameObj
      );
    }
  }
}


class LayerBase {

  constructor(python_layer, gameModel) {
    this.python_layer = python_layer;
    this.gameModel = gameModel;
    const layerClassName = this.python_layer.__class__.toString();
    if (layerClassName.includes("LayerSparse")) {
      this.isLayerSparse = true;
      this.gameObjectIterator = new GameObjectIteratorSparse(this.python_layer);
    } else {
      this.isLayerSparse = false;
      this.gameObjectIterator = new GameObjectIteratorDense(this.python_layer);
    }
    console.log("sparse", this.isLayerSparse);
  }

  updateWithGameSituation(timeNow) {}
  updateTransitions(timeNow) {}
  draw(timeNow) {}

}

export class LayerWithTransition extends LayerBase {

  constructor(
    python_layer,
    gameModel,
    img_coords,
    ctx_canvas_buffer,
    tile_atlas,
    tile_img_width, tile_img_height,
    tile_canvas_width, tile_canvas_height,
  ) {
    super(python_layer, gameModel);
    this.img_coords = img_coords;
    this.ctx_canvas_buffer = ctx_canvas_buffer;
    this.tile_atlas = tile_atlas;
    this.tile_img_width = tile_img_width;
    this.tile_img_height = tile_img_height;
    this.tile_canvas_width = tile_canvas_width;
    this.tile_canvas_height = tile_canvas_height;
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
        console.log("ajout de l'objet : ", gobjId);
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
        gameUpdateResult.hasAnyTransition = true;
        if (gameUpdateResult.uiBlock < gameObj.ui_block_type) {
          gameUpdateResult.uiBlock = gameObj.ui_block_type;
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
          console.log("On doit enlever l'objet : ", gobjId);
          this.layerMemory.delete(gobjId);
        }
      }
    }
    const timeNowLayerAfter = performance.now();
    //console.log("layer analysis z ", timeNowLayerBefore, " ", timeNowLayerAfter);
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
      const [coordImgX, coordImgY] = this.img_coords[gobjState.sprite_name];
      this.ctx_canvas_buffer.drawImage(
        this.tile_atlas,
        coordImgX, coordImgY, this.tile_img_width, this.tile_img_height,
        gobjState.x * this.tile_canvas_width, gobjState.y * this.tile_canvas_height,
        this.tile_canvas_width, this.tile_canvas_height,
      );
    }
  }

}


export class LayerNoTransition extends LayerBase{

  constructor(
    python_layer,
    gameModel,
    img_coords,
    ctx_canvas_buffer,
    tile_atlas,
    tile_img_width, tile_img_height,
    tile_canvas_width, tile_canvas_height,
  ) {
    super(python_layer, gameModel);
    this.img_coords = img_coords;
    this.ctx_canvas_buffer = ctx_canvas_buffer;
    this.tile_atlas = tile_atlas;
    this.tile_img_width = tile_img_width;
    this.tile_img_height = tile_img_height;
    this.tile_canvas_width = tile_canvas_width;
    this.tile_canvas_height = tile_canvas_height;
  }


  updateWithGameSituation(timeNow) {
    return null;
  }


  updateTransitions(timeNow) {
    return null;
  }


  draw(timeNow) {
    for (let coordAndGameObj of this.gameObjectIterator.iterOnGameObjects(
      this.tile_canvas_width, this.tile_canvas_height
    )) {
      const [coordImgX, coordImgY] = this.img_coords[
        coordAndGameObj.gameObj.sprite_name
      ];
      this.ctx_canvas_buffer.drawImage(
        this.tile_atlas,
        coordImgX, coordImgY, this.tile_img_width, this.tile_img_height,
        coordAndGameObj.x, coordAndGameObj.y, this.tile_canvas_width, this.tile_canvas_height,
      );
    }
  }

}
