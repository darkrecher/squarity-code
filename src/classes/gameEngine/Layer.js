import GameObjectTransitioner from './GameObjectTransitioner.js';
import GameUpdateResult from './GameUpdateResult.js'
import { GameObjectIteratorDense, GameObjectIteratorSparse } from './GameObjectIterator.js'
import { isNonePython } from '../common/SimpleFunctions.js';

export const imgAnchor = {
  CORNER_UPLEFT: 0,
  CENTER: 1,
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

  drawOneGameObject(
    ctxCanvasBuffer,
    tileAtlas, atlasDefinitions,
    gobjTransitioner, coordAndGameObj,
    tileImgWidth, tileImgHeight,
    tileCanvasWidth, tileCanvasHeight
  ) {
    // FUTURE: ça devrait être dans un component à part des GameObject.
    // Mais vu que pour l'instant j'ai pas vraiment de GameObject qui gérerait tous ses components,
    // on va mettre ça ici pour l'instant.
    // Et en plus, ça fait passer plein de paramètres qui changent jamais
    // (tileAtlas, atlasDefinitions, tileImgWidth/Height, tileCanvasWidth/Height).
    let coordInGameX;
    let coordInGameY;
    let spriteName;
    let hasImgModifier;
    if (coordAndGameObj !== null) {
      coordInGameX = coordAndGameObj.x;
      coordInGameY = coordAndGameObj.y;
      spriteName = coordAndGameObj.gameObj.sprite_name;
      hasImgModifier = !isNonePython(coordAndGameObj.gameObj.image_modifier);
    } else {
      const compGobjBase = gobjTransitioner.compGobjBase
      coordInGameX = compGobjBase.coordX.fieldValue;
      coordInGameY = compGobjBase.coordY.fieldValue;
      spriteName = compGobjBase.spriteName.fieldValue;
      hasImgModifier = gobjTransitioner.compImageModifier !== null;
    }
    let [
      coordInAtlasX, coordInAtlasY,
      tileInAtlasWidth, tileInAtlasHeight,
      imgAnchorVal,
      scaleAtlasWidth, scaleAtlasHeight
    ] = atlasDefinitions.get(spriteName);

    if (!hasImgModifier) {

      ctxCanvasBuffer.drawImage(
        tileAtlas,
        coordInAtlasX, coordInAtlasY,
        tileInAtlasWidth, tileInAtlasHeight,
        coordInGameX * tileCanvasWidth, coordInGameY * tileCanvasHeight,
        tileCanvasWidth * scaleAtlasWidth, tileCanvasHeight * scaleAtlasHeight,
      );

    } else {

      // FUTURE : truc dégueu parce qu'on est obligé de revérifier coordAndGameObj.
      //          Ça devrait se régler tout seul quand on gérera mieux les components.
      let canvasScaleX;
      let canvasScaleY;
      let canvasOffsetX;
      let canvasOffsetY;
      if (coordAndGameObj !== null) {
        canvasScaleX = coordAndGameObj.gameObj.image_modifier.area_scale_x;
        canvasScaleY = coordAndGameObj.gameObj.image_modifier.area_scale_y;
        canvasOffsetX = coordAndGameObj.gameObj.image_modifier.area_offset_x;
        canvasOffsetY = coordAndGameObj.gameObj.image_modifier.area_offset_y;
      } else {
        const compImageModifier = gobjTransitioner.compImageModifier;
        canvasScaleX = compImageModifier.areaScaleX.fieldValue;
        canvasScaleY = compImageModifier.areaScaleY.fieldValue;
        canvasOffsetX = compImageModifier.areaOffsetX.fieldValue;
        canvasOffsetY = compImageModifier.areaOffsetY.fieldValue;
        coordInAtlasX += compImageModifier.imgOffsetX.fieldValue;
        coordInAtlasY += compImageModifier.imgOffsetY.fieldValue;
        tileInAtlasWidth = compImageModifier.imgSizeX.fieldValue;
        scaleAtlasWidth = tileInAtlasWidth / tileImgWidth;
        tileInAtlasHeight = compImageModifier.imgSizeY.fieldValue;
        scaleAtlasHeight = tileInAtlasHeight / tileImgHeight;
      }
      let anchorOffsetX;
      let anchorOffsetY;
      if (imgAnchorVal == imgAnchor.CENTER) {
        anchorOffsetX = ((1.0-canvasScaleX*scaleAtlasWidth) / 2);
        anchorOffsetY = ((1.0-canvasScaleY*scaleAtlasHeight) / 2);
      } else {
        anchorOffsetX = 0;
        anchorOffsetY = 0;
      }
      ctxCanvasBuffer.drawImage(
        tileAtlas,
        coordInAtlasX,
        coordInAtlasY,
        tileInAtlasWidth,
        tileInAtlasHeight,
        (coordInGameX + canvasOffsetX + anchorOffsetX) * tileCanvasWidth,
        (coordInGameY + canvasOffsetY + anchorOffsetY) * tileCanvasHeight,
        tileCanvasWidth * canvasScaleX * scaleAtlasWidth,
        tileCanvasHeight * canvasScaleY * scaleAtlasHeight
      );

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
    atlasDefinitions,
    ctxCanvasBuffer,
    tileAtlas,
    tileImgWidth, tileImgHeight,
    tileCanvasWidth, tileCanvasHeight,
  ) {
    super(pythonLayer, gameModel);
    this.atlasDefinitions = atlasDefinitions;
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
    let addedAnObject = false;
    let idObjsPresent = new Set();
    let gameUpdateResult = new GameUpdateResult();

    for (let coordAndGameObj of this.gameObjectIterator.iterOnGameObjects()) {
      const gameObj = coordAndGameObj.gameObj;
      const gobjId = gameObj._go_id;
      idObjsPresent.add(gobjId);
      let gobjTransitioner;
      let addedTransitions = false;
      if (!this.layerMemory.has(gobjId)) {
        gobjTransitioner = new GameObjectTransitioner(
          this.gameModel, gameObj, timeNow
        );
        this.layerMemory.set(gobjId, gobjTransitioner);
        gameObj._transitioner = gobjTransitioner;
        addedAnObject = true;
      } else {
        gobjTransitioner = this.layerMemory.get(gobjId);
        if (gameObj._must_clear_transitions) {
          gobjTransitioner.clearAllTransitions(timeNow);
        }
        addedTransitions = gobjTransitioner.addTransitionsFromNewState(timeNow);
      }
      if (gobjTransitioner.addTransitionsFromRecords(timeNow)) {
        addedTransitions = true;
      }
      if (addedTransitions) {
        gameUpdateResult.addedTransitions = true;
        if (gameUpdateResult.PlockTransi < gameObj.plock_transi) {
          gameUpdateResult.PlockTransi = gameObj.plock_transi;
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
    return gameUpdateResult;
  }

  updateTransitions(timeNow) {
    const mergedGameUpdateResult = new GameUpdateResult();
    for (let gobjTransitioner of this.layerMemory.values()) {
      const gameUpdateResult = gobjTransitioner.updateTransitions(timeNow);
      if (gameUpdateResult !== null) {
        mergedGameUpdateResult.merge(gameUpdateResult);
      }
    }
    return mergedGameUpdateResult;
  }

  draw(timeNow) {
    // FUTURE : Éventuellement, mettre en cache l'image du layer en cours, si c'en est un qu'a pas de transitions.
    for (let gobjTransitioner of this.layerMemory.values()) {
      gobjTransitioner.updateState(timeNow);
      this.drawOneGameObject(
        this.ctxCanvasBuffer,
        this.tileAtlas, this.atlasDefinitions,
        gobjTransitioner, null,
        this.tileImgWidth, this.tileImgHeight,
        this.tileCanvasWidth, this.tileCanvasHeight
      );
    }
  }

}


export class LayerNoTransition extends LayerBase{

  constructor(
    pythonLayer,
    gameModel,
    atlasDefinitions,
    ctxCanvasBuffer,
    tileAtlas,
    tileImgWidth, tileImgHeight,
    tileCanvasWidth, tileCanvasHeight,
  ) {
    super(pythonLayer, gameModel);
    this.atlasDefinitions = atlasDefinitions;
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
    for (let coordAndGameObj of this.gameObjectIterator.iterOnGameObjects()) {
      this.drawOneGameObject(
        this.ctxCanvasBuffer,
        this.tileAtlas, this.atlasDefinitions,
        null, coordAndGameObj,
        this.tileImgWidth, this.tileImgHeight,
        this.tileCanvasWidth, this.tileCanvasHeight
      );
    }
  }

}
