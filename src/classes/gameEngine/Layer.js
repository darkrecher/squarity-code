import GameObjectTransitioner from './GameObjectTransitioner.js';

class CoordAndGameObject {
  constructor(x, y, gameObj) {
    this.x = x;
    this.y = y;
    this.gameObj = gameObj;
  }
}

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

  constructor(python_layer) {
    this.python_layer = python_layer;
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
  draw(timeNow) {}
  hasAnyTransition() {}
  clearEndedTransitions(timeNow) {}

}

export class LayerWithTransition extends LayerBase {

  constructor(
    python_layer,
    img_coords,
    ctx_canvas_buffer,
    tile_atlas,
    tile_img_width, tile_img_height,
    tile_canvas_width, tile_canvas_height,
  ) {
    super(python_layer);
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
    // On envoie les addTransitions aux objets que y'a dans le layer.
    const timeNowLayerBefore = performance.now();
    let addedAnObject = false;
    let idObjsPresent = new Set();

    for (let coordAndGameObj of this.gameObjectIterator.iterOnGameObjects(1, 1)) {
      const gameObj = coordAndGameObj.gameObj;
      const gobjId = gameObj._go_id;
      idObjsPresent.add(gobjId);
      let gobjTransitioner;
      if (!this.layerMemory.has(gobjId)) {
        gobjTransitioner = new GameObjectTransitioner(
          coordAndGameObj.x, coordAndGameObj.y, gameObj
        );
        this.layerMemory.set(gobjId, gobjTransitioner);
        console.log("ajout de l'objet : ", gobjId);
        addedAnObject = true;
      } else {
        gobjTransitioner = this.layerMemory.get(gobjId);
        gobjTransitioner.addTransitions(
          coordAndGameObj.x, coordAndGameObj.y, gameObj, timeNow
        );
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
  }


  draw(timeNow) {
    // FUTURE : Éventuellement, mettre en cache l'image du layer en cours, si c'en est un qu'a pas de transitions.
    for (let [gobjId, gobjTransitioner] of this.layerMemory) {
      const gobjState = gobjTransitioner.getCurrentState(timeNow);
      const [coordImgX, coordImgY] = this.img_coords[gobjState.img];
      this.ctx_canvas_buffer.drawImage(
        this.tile_atlas,
        coordImgX, coordImgY, this.tile_img_width, this.tile_img_height,
        gobjState.x * this.tile_canvas_width, gobjState.y * this.tile_canvas_height,
        this.tile_canvas_width, this.tile_canvas_height,
      );
    }
  }


  hasAnyTransition() {
    for (let [gobjId, gobjTransitioner] of this.layerMemory) {
      if (gobjTransitioner.hasTransitions()) {
        return true;
      }
    }
    return false;
  }


  clearEndedTransitions(timeNow) {
    for (let [gobjId, gobjTransitioner] of this.layerMemory) {
      gobjTransitioner.clearEndedTransitions(timeNow);
    }
  }

}




export class LayerNoTransition extends LayerBase{

  constructor(
    python_layer,
    img_coords,
    ctx_canvas_buffer,
    tile_atlas,
    tile_img_width, tile_img_height,
    tile_canvas_width, tile_canvas_height,
  ) {
    super(python_layer);
    this.img_coords = img_coords;
    this.ctx_canvas_buffer = ctx_canvas_buffer;
    this.tile_atlas = tile_atlas;
    this.tile_img_width = tile_img_width;
    this.tile_img_height = tile_img_height;
    this.tile_canvas_width = tile_canvas_width;
    this.tile_canvas_height = tile_canvas_height;
  }


  updateWithGameSituation(timeNow) {}


  draw(timeNow) {
    for (let coordAndGameObj of this.gameObjectIterator.iterOnGameObjects(
      this.tile_canvas_width, this.tile_canvas_height
    )) {
      const [coordImgX, coordImgY] = this.img_coords[
        coordAndGameObj.gameObj.img
      ];
      this.ctx_canvas_buffer.drawImage(
        this.tile_atlas,
        coordImgX, coordImgY, this.tile_img_width, this.tile_img_height,
        coordAndGameObj.x, coordAndGameObj.y, this.tile_canvas_width, this.tile_canvas_height,
      );
    }
  }


  hasAnyTransition() {
    return false;
  }


  clearEndedTransitions(timeNow) {}

}