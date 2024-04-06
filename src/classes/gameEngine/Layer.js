import GameObjectTransitioner from './GameObjectTransitioner.js';

export default class Layer {

  constructor(
    python_layer,
    img_coords,
    ctx_canvas_buffer,
    tile_atlas,
    tile_img_width, tile_img_height,
    tile_canvas_width, tile_canvas_height,
  ) {
    this.python_layer = python_layer;
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
    this.layerMemory = new Map();
    // TODO: prendre directement les trucs qui changent pas, genre show_transitions.
  }


  updateWithPythonLayer(timeNow) {
    // Pour les layers qui ont des transitions, on envoie les addTransitions aux objets que y'a dedans.
    // TODO: si c'est un layer sparse, c'est pas géré pareil.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    if (this.python_layer.show_transitions) {
      const timeNowLayerBefore = performance.now();
      // TODO: un truc générique pour itérer sur les gameobjects, que ce soit un layer ou un layer sparse.
      let y = 0;
      let x;
      let addedAnObject = false;
      let idObjsPresent = new Set();
      for (let line of this.python_layer.tiles) {
        x = 0;
        for (let tile of line) {
          for (let gameObj of tile.game_objects) {
            const gobjId = gameObj._go_id;
            idObjsPresent.add(gobjId);
            let gobjTransitioner;
            if (!this.layerMemory.has(gobjId)) {
              gobjTransitioner = new GameObjectTransitioner(x, y, gameObj);
              this.layerMemory.set(gobjId, gobjTransitioner);
              console.log("ajout de l'objet : ", gobjId);
              addedAnObject = true;
            } else {
              gobjTransitioner = this.layerMemory.get(gobjId);
              gobjTransitioner.addTransitions(x, y, gameObj, timeNow);
            }
          }
          x += 1;
        }
        y += 1;
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

    } else {
      this.layerMemory.clear();
    }
  }


  drawLayer(timeNow) {
    if (this.python_layer.show_transitions) {

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

    } else {

      let canvasX = 0;
      let canvasY = 0;
      // TODO: et c'est re pas ça si c'est un layer sparse.
      for (let lineTile of this.python_layer.tiles) {
        for (let tile of lineTile) {
          for (let gameObj of tile.game_objects) {
            // Pour récupérer la classe et un identifiant unique : gameObj.toString()
            // Ça renvoit un truc comme ça : "<GameObject object at 0x9e81e8>".
            // Mais ça me semble hasardeux. Je gérerais l'unicité avec la fonction id du python.
            //console.log(gameObj.toString());
            // Pour récupérer la classe, on peut faire ça : gameObj.__class__.toString()
            // On récupère ceci : "<class 'GameObject'>". Et ça me semble pas trop dégueux.
            //console.log(gameObj.__class__.toString());
            const [coordImgX, coordImgY] = this.img_coords[gameObj.img];
            this.ctx_canvas_buffer.drawImage(
              this.tile_atlas,
              coordImgX, coordImgY, this.tile_img_width, this.tile_img_height,
              canvasX, canvasY, this.tile_canvas_width, this.tile_canvas_height,
              );
            }
            canvasX += this.tile_canvas_width;
          }
          canvasX = 0;
          canvasY += this.tile_canvas_height;
        }

    }
  }


  hasAnyTransition() {
    if (this.python_layer.show_transitions) {
      for (let [gobjId, gobjTransitioner] of this.layerMemory) {
        if (gobjTransitioner.hasTransitions()) {
          return true;
        }
      }
    }
    return false;
  }


  clearEndedTransitions(timeNow) {
    if (this.python_layer.show_transitions) {
      for (let [gobjId, gobjTransitioner] of this.layerMemory) {
        gobjTransitioner.clearEndedTransitions(timeNow);
      }
    }
  }

}
