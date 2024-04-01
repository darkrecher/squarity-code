import { Direction } from './gameEngineV1.js';
import GameObjectTransitioner from './gameEngine/GameObjectTransitioner.js';


const defaultTileSize = 32;
const defaultNbTileWidth = 20;
const defaultNbTileHeight = 14;


export default class GameEngineV2 {

  constructor(
    python_console,
    pyodide,
    onAfterGameEvent,
    game_canvas,
    canvas_buffer,
    libSquarityCode
  ) {
    this.version = "2.0.0";
    this.python_console = python_console;
    this.pyodide = pyodide;
    this.onAfterGameEvent = onAfterGameEvent;
    this.game_canvas = game_canvas;
    this.canvas_buffer = canvas_buffer;
    this.ctx_canvas = this.game_canvas.getContext('2d');
    this.ctx_canvas_buffer = this.canvas_buffer.getContext('2d');
    // https://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering
    // clear canvas
    this.ctx_canvas_buffer.fillStyle = '#000000';
    // https://stackoverflow.com/questions/31910043/html5-canvas-drawimage-draws-image-blurry
    this.ctx_canvas_buffer.imageSmoothingEnabled = false;

    this.layers = null;
    // mapLayers contient, pour chaque layer, un "layerMemory".
    // Le layerMemory est un sous-Map qui contient, pour chaque objet du layer, un GameObjectTransitioner.
    // Ce GameObjectTransitioner contient les transitions en cours pour l'objet, et l'état actuel de l'objet.
    // (Il n'y a pas forcément de transition en cours, mais il faut au moins le GameObjectTransitioner
    // pour l'afficher dans l'aire de jeu).
    this.mapLayers = new Map();
    this.delayed_actions = [];
    this.has_click_handling = false;
    this.configGameSizes(defaultTileSize, defaultNbTileWidth, defaultNbTileHeight);

    this.pythonDirFromJsDir = new Map();
    this.pythonDirFromJsDir.set(Direction.Up, 'dirs.Up');
    this.pythonDirFromJsDir.set(Direction.Right, 'dirs.Right');
    this.pythonDirFromJsDir.set(Direction.Down, 'dirs.Down');
    this.pythonDirFromJsDir.set(Direction.Left, 'dirs.Left');

    // J'ai pas trouvé comment on importe un module python homemade dans pyodide.
    // Il y a des docs qui expliquent comment créer un package avec wheel et micropip.
    // J'ai pas trop compris le principe, et ça me semble un peu overkill.
    // Alors j'y vais à la bourrin : je charge tout le code dans une string
    // et je la balance ensuite directement à la fonction runPython.
    this.runPython(
        libSquarityCode,
        'Interprétation de la lib python squarity',
      );
  }

  isPlayerLocked() {
    return (this.player_locks.length !== 0);
  }

  getRatioFromWidthToHeight() {
    return this.ratioFromWidthToHeight;
  }

  updateGameSpec(tile_atlas, json_conf, gameCode) {

    let tileSize = defaultTileSize;
    let areaWidth = defaultNbTileWidth;
    let areaHeight = defaultNbTileHeight;
    if ('tile_size' in json_conf) {
      tileSize = json_conf.tile_size;
    }
    if ('game_area' in json_conf) {
      const jsonConfGameArea = json_conf.game_area;
      if ('nb_tile_width' in jsonConfGameArea) {
        areaWidth = jsonConfGameArea.nb_tile_width;
      }
      if ('w' in jsonConfGameArea) {
        areaWidth = jsonConfGameArea.w;
      }
      if ('nb_tile_height' in jsonConfGameArea) {
        areaHeight = jsonConfGameArea.nb_tile_height;
      }
      if ('h' in jsonConfGameArea) {
        areaHeight = jsonConfGameArea.h;
      }
    }
    this.configGameSizes(tileSize, areaWidth, areaHeight);
    this.img_coords = json_conf.img_coords;
    this.tile_atlas = tile_atlas;

    // On annule toutes les delayed actions du jeu précédent.
    for (let timeoutId of this.delayed_actions) {
      clearTimeout(timeoutId);
    }
    this.player_locks = [];
    this.delayed_actions = [];

    this.runPython(
      gameCode,
      'Interprétation du gameCode.',
    );
    this.runPython(
      `game_model = GameModel(${areaWidth}, ${areaHeight}, "TODO:json_conf")`,
      'Instanciation du GameModel',
    );
    this.runPython(
      `game_model.on_start()`,
      'Exécution de game_model.on_start',
    );
    // Vérification si ce game code a une fonction qui gère les clics.
    this.has_click_handling = this.runPython(
      'hasattr(game_model, "on_click")',
      'Vérification de la présence de on_click',
    );
  }

  onButtonDirection(direction) {
    if (this.isPlayerLocked()) {
      return;
    }
    const pythonDir = this.pythonDirFromJsDir.get(direction);
    const eventResultRaw = this.runPython(
      `game_model.on_button_direction(${pythonDir})`,
      `Événement de bouton de direction ${pythonDir}`,
    );
    let mustRedraw = true;
    if (!this.isNonePython(eventResultRaw)) {
      mustRedraw = this.processGameEventResult(eventResultRaw);
    }
    if (mustRedraw) {
      this.drawRect();
    }
    this.onAfterGameEvent();
  }

  onButtonAction(actionName) {
    if (this.isPlayerLocked()) {
      return;
    }
    const eventResultRaw = this.runPython(
      `game_model.on_button_action("${actionName}")`,
      `Exécution d'une action ${actionName}`,
    );
    // TODO : c'est un peu du duplicate code avec la fonction au-dessus.
    let mustRedraw = true;
    if (!this.isNonePython(eventResultRaw)) {
      mustRedraw = this.processGameEventResult(eventResultRaw);
    }
    if (mustRedraw) {
      this.drawRect();
    }
    this.onAfterGameEvent();
  }

  execGameCallback(gameCallback) {
    // TODO : c'est un peu du duplicate code.
    let eventResultRaw;
    try {
      // resultPython = this.pyodide.runPython(pythonCode);
      eventResultRaw = gameCallback();
    } catch (err) {
      const errMessage = err.message;
      this.printGameConsole(`Erreur python durant l'exécution d'une callback\n${errMessage}`);
      // Je rethrow l'exception, parce que si le code python déconne,
      // vaut mieux pas essayer de faire d'autres choses après.
      throw err;
    }
    let mustRedraw = true;
    if (!this.isNonePython(eventResultRaw)) {
      mustRedraw = this.processGameEventResult(eventResultRaw);
    }
    if (mustRedraw) {
      this.drawRect();
    }
    this.onAfterGameEvent();
  }

  onGameClick(e) {
    if (!this.has_click_handling) {
      return;
    }
    if (this.isPlayerLocked()) {
      return;
    }
    // https://thewebdev.info/2021/03/21/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
    const rect = this.game_canvas.getBoundingClientRect();
    const clicked_tile_x = Math.floor((e.offsetX * this.nb_tile_width) / rect.width);
    const clicked_tile_y = Math.floor((e.offsetY * this.nb_tile_height) / rect.height);
    if (
      !(
        (clicked_tile_x >= 0)
        && (clicked_tile_x < this.nb_tile_width)
        && (clicked_tile_y >= 0)
        && (clicked_tile_y < this.nb_tile_height)
      )
    ) {
      return;
    }
    const eventResultRaw = this.runPython(
      `game_model.on_click(${clicked_tile_x}, ${clicked_tile_y})`,
      `Exécution de on_click sur (${clicked_tile_x}, ${clicked_tile_x})`,
    );
    let mustRedraw = true;
    if (!this.isNonePython(eventResultRaw)) {
      mustRedraw = this.processGameEventResult(eventResultRaw);
    }
    if (mustRedraw) {
      this.drawRect();
    }
    this.onAfterGameEvent();
  }

  drawRect() {
    // TODO : faut pas du tout appeler ça drawRect.

    const timeNowStart = performance.now();
    this.layers = this.runPython(
      'game_model.layers',
      'Récupération des layers pour les dessiner',
    );
    const timeNow = performance.now();

    // Pour les layers qui ont des transitions, on envoie les addTransitions aux objets que y'a dedans.
    for (let layer of this.layers) {
      const layerId = layer._l_id;
      if (!this.mapLayers.has(layerId)) {
        this.mapLayers.set(layerId, new Map());
      }
      const layerMemory = this.mapLayers.get(layerId);
      // TODO: si c'est un layer sparse, c'est pas géré pareil.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
      if (layer.show_transitions) {
        const timeNowLayerBefore = performance.now();
        // TODO: un truc générique pour itérer sur les gameobjects, que ce soit un layer ou un layer sparse.
        let y = 0;
        let x;
        let addedAnObject = false;
        let idObjsPresent = new Set();
        for (let line of layer.tiles) {
          x = 0;
          for (let tile of line) {
            const gameObjects = tile.game_objects;
            for (let gameObj of gameObjects) {
              const gobjId = gameObj._go_id;
              idObjsPresent.add(gobjId);
              let gobjTransitioner;
              if (!layerMemory.has(gobjId)) {
                gobjTransitioner = new GameObjectTransitioner(x, y, gameObj);
                layerMemory.set(gobjId, gobjTransitioner);
                console.log("ajout de l'objet : ", gobjId);
                addedAnObject = true;
              } else {
                gobjTransitioner = layerMemory.get(gobjId);
                gobjTransitioner.addTransitions(x, y, gameObj, timeNow);
              }
            }
            x += 1;
          }
          y += 1;
        }
        if (addedAnObject || (idObjsPresent.size !== layerMemory.size)) {
          // On ne peut plus trop se fier au nombre d'objets précédent et au nombre d'objet courant.
          // Ça veut dire qu'il faut peut-être enlever des objets.
          // Il faut itérer sur les objets dans layerMemory.
          // Si un objet n'est pas dans idObjsPresent, c'est qu'il a disparu.
          const idObjsPrevious = layerMemory.keys();
          for (let gobjId of idObjsPrevious) {
            if (!idObjsPresent.has(gobjId)) {
              console.log("On doit enlever l'objet : ", gobjId);
              layerMemory.delete(gobjId);
            }
          }
        }
        const timeNowLayerAfter = performance.now();
        console.log("layer analysis z ", timeNowLayerBefore, " ", timeNowLayerAfter);

      } else {
        layerMemory.clear();
      }
    }

    const timeNowAfterAnalysis = performance.now();
    // on dessine l'état actuel. Faut tout redessiner.
    this.drawCurrentGameBoardState(timeNow)
    const timeNowAfterDraw = performance.now();
    console.log("times. start", timeNowStart, " after python", timeNow, " after analysis ", timeNowAfterAnalysis, " after first draw ", timeNowAfterDraw);

    // On regarde si il y a encore des transitions en cours.
    // Si oui, on demande un nouvel affichage de l'aire de jeu, "pour la prochaine fois".
    if (this.hasAnyTransition()) {
      window.requestAnimationFrame(() => { this.updateAndDrawGameBoard() });
    }
  }

  drawCurrentGameBoardState(timeNow) {
    // J'ai tenté clearRect. Mais ça ne marche pas bien.
    // Mon bonhomme reste dessiné sur les cases noires. Osef.
    this.ctx_canvas_buffer.fillRect(
      0, 0,
      this.game_canvas.width, this.game_canvas.height
    );
    for (let layer of this.layers) {
      if (layer.show_transitions) {
        const layerId = layer._l_id;
        const layerMemory = this.mapLayers.get(layerId);
        this.drawLayerWithTransitions(layer, layerMemory, timeNow);
      } else {
        this.drawLayerNoTransitions(layer);
      }
    }
    this.ctx_canvas.drawImage(this.canvas_buffer, 0, 0);
  }

  hasAnyTransition() {
    for (let layer of this.layers) {
      if (layer.show_transitions) {
        const layerId = layer._l_id;
        const layerMemory = this.mapLayers.get(layerId);
        for (let [gobjId, gobjTransitioner] of layerMemory) {
          if (gobjTransitioner.hasTransitions()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  clearEndedTransitions(timeNow) {
    for (let layer of this.layers) {
      if (layer.show_transitions) {
        const layerId = layer._l_id;
        const layerMemory = this.mapLayers.get(layerId);
        for (let [gobjId, gobjTransitioner] of layerMemory) {
          gobjTransitioner.clearEndedTransitions(timeNow);
        }
      }
    }
  }

  updateAndDrawGameBoard() {
    const timeNow = performance.now();
    // On enlève les transitions passées.
    this.clearEndedTransitions(timeNow);
    // On dessine l'état actuel.
    this.drawCurrentGameBoardState(timeNow);
    // On regarde si il y a encore des transitions en cours.
    // Si oui, on redemande un affichage pour plus tard.
    if (this.hasAnyTransition()) {
      window.requestAnimationFrame(() => { this.updateAndDrawGameBoard() });
    }
  }

  // TODO : et je le vois venir qu'il me faudra une classe layer...
  // Comme ça on peut gérer pour chacun si ils ont des transitions.
  // Éventuellement, mettre en cache l'image du layer en cours, si c'en est un qu'a pas de transitions.

  // Les méthodes ci-dessous sont privées.
  // Il est possible de l'indiquer "officiellement", avec la syntaxe #private :
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties
  // Sauf que c'est pas supporté par tous les navigateurs, alors je prends pas le risque.
  drawLayerWithTransitions(layer, layerMemory, timeNow) {
    for (let [gobjId, gobjTransitioner] of layerMemory) {
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

  drawLayerNoTransitions(layer) {
    let canvasX = 0;
    let canvasY = 0;
    for (let y = 0; y < this.nb_tile_height; y += 1) {
      for (let x = 0; x < this.nb_tile_width; x += 1) {
        const gameObjects = layer.tiles[y][x].game_objects;
        for (let gameObj of gameObjects) {
          // Pour récupérer la classe et un identifiant unique : gameObj.toString()
          // Ça renvoit un truc comme ça : "<GameObject object at 0x9e81e8>".
          // Mais ça me semble hasardeux. Je gérerais l'unicité avec la fonction id du python.
          console.log(gameObj.toString());
          // Pour récupérer la classe, on peut faire ça : gameObj.__class__.toString()
          // On récupère ceci : "<class 'GameObject'>". Et ça me semble pas trop dégueux.
          console.log(gameObj.__class__.toString());
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

  runPython(pythonCode, codeLabel) {
    let resultPython = null;
    try {
      resultPython = this.pyodide.runPython(pythonCode);
    } catch (err) {
      const errMessage = err.message;
      this.printGameConsole(`Erreur python durant l'action : \n${codeLabel}\n${errMessage}`);
      // Je rethrow l'exception, parce que si le code python déconne,
      // vaut mieux pas essayer de faire d'autres choses après.
      throw err;
    }
    return resultPython;
  }

  configGameSizes(tileSize, nbTileWidth, nbTileHeight) {
    // Définition de la taille interne du canvas (canvasElem) et de la taille de la zone de dessin
    // (this.canvas_buffer). C'est la même taille pour les deux, mais ça ne correspond pas
    // à la taille réelle du canvas dans le DOM. Cette taille réelle est définie
    // à un autre endroit du code (et de manière assez inavouable) (voir GameBoard.handleResize).
    this.tile_canvas_width = tileSize;
    this.tile_canvas_height = tileSize;
    this.tile_img_width = tileSize;
    this.tile_img_height = tileSize;
    this.nb_tile_width = nbTileWidth;
    this.nb_tile_height = nbTileHeight;
    const canvasWidth = this.nb_tile_width * this.tile_canvas_width;
    const canvasHeight = this.nb_tile_height * this.tile_canvas_height;
    this.ratioFromWidthToHeight = canvasHeight / canvasWidth;

    this.game_canvas.width = canvasWidth;
    this.game_canvas.height = canvasHeight;
    this.canvas_buffer.width = canvasWidth;
    this.canvas_buffer.height = canvasHeight;
  }

  isNonePython(val) {
    // Quand du code python renvoie None, la variable javascript prend la valeur "undefined"

    // https://www.tutorialrepublic.com/faq/how-to-determine-if-variable-is-undefined-or-null-in-javascript.php
    // La manière de vérifier si une variable est "undefined" en javascript est
    // vraiment dégueulasse, mais tout le monde fait comme ça.
    // "undefined" est un mot-clé de base du javascript, mais pour tester cette valeur,
    // il faut passer par un typeof et une comparaison de chaîne de caractères.
    // Tu te fous vraiment de ma gueule, javascript.
    return typeof val === 'undefined';
  }

  printGameConsole(msg) {
    const pythonConsole = this.python_console;
    pythonConsole.textContent += msg;
    pythonConsole.scrollTop = pythonConsole.scrollHeight;
  }

  processDelayedAction(timeOutIdProcessing, gameCallback) {
    this.delayed_actions = this.delayed_actions.filter((eventId) => eventId !== timeOutIdProcessing);
    this.execGameCallback(gameCallback);
  }

  processGameEventResult(eventResultRaw) {
    console.log("eventResultRaw");
    console.log(eventResultRaw);
    let mustRedraw = true;
    if (eventResultRaw.delayed_actions) {
      for (let newDelayedAction of eventResultRaw.delayed_actions) {
        let delayTime = 0;
        if (newDelayedAction.delay_ms) {
          delayTime = newDelayedAction.delay_ms;
        }
        if (newDelayedAction.callback) {
          // On peut utiliser l'identifiant renvoyé par setTimeout
          // à l'intérieur de la fonction callback du setTimeout.
          // Ça a l'air complètement fumé mais ça marche ... Magie JavaScript !!!
          // https://stackoverflow.com/questions/17280375/in-javascript-how-can-i-access-the-id-of-settimeout-setinterval-call-from-insid
          console.log("on balance une callback t", delayTime);
          console.log("on balance une callback c", newDelayedAction.callback);
          const timeOutId = setTimeout(() => {
            this.processDelayedAction(timeOutId, newDelayedAction.callback);
          }, delayTime);
          this.delayed_actions.push(timeOutId);
        }
      }
    }
    if (eventResultRaw.player_locks) {
      for (let lockName of eventResultRaw.player_locks) {
        if (!this.player_locks.includes(lockName)) {
          this.player_locks.push(lockName);
        }
      }
    }
    if (eventResultRaw.player_unlocks) {
      for (let unlockName of eventResultRaw.player_unlocks) {
        if (unlockName === '*') {
          this.player_locks = [];
        } else {
          this.player_locks = this.player_locks.filter((lockLoop) => lockLoop !== unlockName);
        }
      }
    }
    if ('redraw' in eventResultRaw) {
      // https://stackoverflow.com/questions/3390396/how-can-i-check-for-undefined-in-javascript
      if (eventResultRaw.redraw !== undefined) {
        if (!eventResultRaw.redraw) {
          // redraw a été explicitement définie (donc pas "undefined"), à 0 ou à False.
          // Si le code du jeu définit redraw à None, une liste vide, ou autre,
          // le javascript va considérer que c'est True. Ce qui ne correspond pas à pensée pythonienne.
          // En même temps, faudrait être tordu pour faire ça.
          mustRedraw = false;
        }
      }
    }
    return mustRedraw;
  }

}
