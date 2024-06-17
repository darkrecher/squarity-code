import { Direction } from './gameEngineV1.js';
import { LayerWithTransition, LayerNoTransition } from './gameEngine/Layer.js';
import GameUpdateResult from './gameEngine/GameUpdateResult.js'


const defaultTileSize = 32;
const defaultNbTileWidth = 20;
const defaultNbTileHeight = 14;


export default class GameEngineV2 {

  constructor(
    python_console,
    pyodide,
    refreshUiLockType,
    game_canvas,
    canvas_buffer,
    libSquarityCode
  ) {
    this.version = "2.0.0";
    this.python_console = python_console;
    this.pyodide = pyodide;
    this.refreshUiLockType = refreshUiLockType;
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
    // mapLayers contient des objets Layer.
    this.mapLayers = new Map();
    // orderedLayers contient les Layers, dans l'ordre d'affichage.
    // On a les mêmes objets dans les values de mapLayers et dans orderedLayers.
    this.orderedLayers = [];
    this.delayed_actions = [];
    this.has_click_handling = false;
    this.showing_transition = false;
    this.player_locks = [];
    this.currentLockType = GameUpdateResult.UI_NO_BLOCK;
    this.configGameSizes(defaultTileSize, defaultNbTileWidth, defaultNbTileHeight);

    this.pythonDirFromJsDir = new Map();
    this.pythonDirFromJsDir.set(Direction.Up, 'squarity.dirs.Up');
    this.pythonDirFromJsDir.set(Direction.Right, 'squarity.dirs.Right');
    this.pythonDirFromJsDir.set(Direction.Down, 'squarity.dirs.Down');
    this.pythonDirFromJsDir.set(Direction.Left, 'squarity.dirs.Left');

    // Pour pouvoir importer un module python, il faut créer un fichier,
    // puis l'importer. En vrai, ça fait pas un fichier, ça écrit dans
    // un espèce d'espace virtuel du navigateur, mais ça va très bien comme ça.
    // Par contre: ne pas oublier de faire sys.path.append(".")
    // Sinon, l'import ne marche pas. Pyodide n'acceptera pas de récupérer le fichier.
    // Et ça, c'est pas dit dans leur doc, et c'est un peu relou.
    // Extraitr doc de pyodide:
    // https://pyodide.org/en/stable/usage/loading-custom-python-code.html
    // https://pyodide.org/en/stable/usage/loading-packages.html
    document.lib_squarity_code = libSquarityCode;
     this.runPython('' +
        'import js\n' +
        'with open("squarity.py", "w", encoding="utf-8") as f:\n' +
        '    f.write(js.document.lib_squarity_code)\n' +
        'import sys\n' +
        'sys.path.append(".")\n',
      'Création du fichier contenant la lib squarity',
    );
    // Correspond à game_model dans le code python.
    this.gameModel = null;

  }

  hasUiLockTypeChanged(newUiTransiLock) {
    let newLockType = 0;
    if (newUiTransiLock == GameUpdateResult.UI_INVISIBLE_BLOCK) {
      newLockType = GameUpdateResult.UI_INVISIBLE_BLOCK;
    } else if ((this.player_locks.length !== 0) || (newUiTransiLock === GameUpdateResult.UI_BLOCK)) {
      newLockType = GameUpdateResult.UI_BLOCK;
    }
    if (this.currentLockType !== newLockType) {
      console.log("Changement de block type !", this.currentLockType, " => ", newLockType);
      this.currentLockType = newLockType;
      return true
    } else {
      return false;
    }
  }

  getLockType() {
    return this.currentLockType;
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
    this.currentLockType = GameUpdateResult.UI_NO_BLOCK;
    this.delayed_actions = [];

    this.runPython(
      gameCode,
      'Interprétation du gameCode.',
    );
    document.json_conf = JSON.stringify(json_conf);
    this.runPython(
      `game_model = GameModel(${areaWidth}, ${areaHeight}, js.document.json_conf)`,
      'Instanciation du GameModel',
    );
    this.gameModel = this.runPython(
      `game_model`,
      'Récupération du game_model',
    );
    // TODO: appeler directement on_start, et catcher les exceptions comme pour l'exécution de callbacks.
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
    if (this.currentLockType) {
      return;
    }
    const pythonDir = this.pythonDirFromJsDir.get(direction);
    const eventResultRaw = this.runPython(
      `game_model.on_button_direction(${pythonDir})`,
      `Événement de bouton de direction ${pythonDir}`,
    );
    this.afterGameEvent(eventResultRaw);
  }

  onButtonAction(actionName) {
    if (this.currentLockType) {
      return;
    }
    const eventResultRaw = this.runPython(
      `game_model.on_button_action("${actionName}")`,
      `Exécution d'une action ${actionName}`,
    );
    this.afterGameEvent(eventResultRaw);
  }

  execGameCallback(gameCallback) {
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
    this.afterGameEvent(eventResultRaw);
  }

  onGameClick(e) {
    if (!this.has_click_handling) {
      return;
    }
    if (this.currentLockType) {
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
      `game_model.on_click(Coord(${clicked_tile_x}, ${clicked_tile_y}))`,
      `Exécution de on_click sur (${clicked_tile_x}, ${clicked_tile_x})`,
    );
    this.afterGameEvent(eventResultRaw);
  }

  updateFromPythonData(mustRedraw) {

    const timeNowStart = performance.now();
    const python_layers = this.gameModel.layers;
    const timeNow = performance.now();

    this.orderedLayers = []
    for (let python_layer of python_layers) {
      const layerId = python_layer._l_id;
      if (!this.mapLayers.has(layerId)) {
        let newLayer;
        if (python_layer.show_transitions) {
          newLayer = new LayerWithTransition(
            python_layer,
            this.gameModel,
            this.img_coords,
            this.ctx_canvas_buffer,
            this.tile_atlas,
            this.tile_img_width, this.tile_img_height,
            this.tile_canvas_width, this.tile_canvas_height,
          );
        } else {
          newLayer = new LayerNoTransition(
            python_layer,
            this.gameModel,
            this.img_coords,
            this.ctx_canvas_buffer,
            this.tile_atlas,
            this.tile_img_width, this.tile_img_height,
            this.tile_canvas_width, this.tile_canvas_height,
          );
        }
        this.mapLayers.set(layerId, newLayer);
      }
      const layer = this.mapLayers.get(layerId);
      this.orderedLayers.push(layer);
    }
    const gameUpdateResult = new GameUpdateResult();
    for (let layer of this.orderedLayers) {
      const gameUpdateResultNew = layer.updateWithGameSituation(timeNow);
      if (gameUpdateResultNew != null) {
        gameUpdateResult.merge(gameUpdateResultNew);
      }
    }
    // Il n'est pas censé y avoir de callback enregistrée dans gameUpdateResult.
    // Ces callbacks ne peuvent arriver que quand on update des transitions
    // (et aussi avec le eventresultraw, mais ça c'est autre chose).

    const timeNowAfterAnalysis = performance.now();
    if (mustRedraw) {
      // On dessine l'état actuel. Faut tout redessiner.
      this.drawCurrentGameBoardState(timeNow)
    }
    const timeNowAfterDraw = performance.now();
    console.log(
      "times. start", timeNowStart, " after python", timeNow, " after analysis ", timeNowAfterAnalysis, " after first draw ", timeNowAfterDraw,
      " uiBlock ", gameUpdateResult.uiBlock
    );

    // On regarde si il y a encore des transitions en cours.
    // Si oui, on demande un nouvel affichage de l'aire de jeu, "pour la prochaine fois".
    if (gameUpdateResult.hasAnyTransition) {
      // Mais avant de demander un nouvel affichage, on vérifie qu'on n'est pas déjà en train
      // de faire des transitions, et donc d'afficher périodiquement l'état du jeu.
      // Si c'est le cas, pas la peine de redemander un affichage en plus.
      if (!this.showing_transition) {
        window.requestAnimationFrame(() => { this.updateAndDrawGameBoard() });
        this.showing_transition = true;
      }
    }
    if (this.hasUiLockTypeChanged(gameUpdateResult.uiBlock)) {
      this.refreshUiLockType();
    }
  }

  drawCurrentGameBoardState(timeNow) {
    // J'ai tenté clearRect. Mais ça ne marche pas bien.
    // Mon bonhomme reste dessiné sur les cases noires. Osef.
    this.ctx_canvas_buffer.fillRect(
      0, 0,
      this.game_canvas.width, this.game_canvas.height
    );
    for (let layer of this.orderedLayers) {
      layer.draw(timeNow);
    }
    this.ctx_canvas.drawImage(this.canvas_buffer, 0, 0);
  }


  updateAndDrawGameBoard() {
    const timeNow = performance.now();

    const mergedGameUpdateResult = new GameUpdateResult();
    for (let layer of this.orderedLayers) {
      const gameUpdateResult = layer.updateTransitions(timeNow);
      if (gameUpdateResult !== null) {
        mergedGameUpdateResult.merge(gameUpdateResult);
      }
    }

    // On dessine l'état actuel.
    this.drawCurrentGameBoardState(timeNow);
    // On regarde si il y a encore des transitions en cours.
    // Si oui, on redemande un affichage pour plus tard.
    if (mergedGameUpdateResult.hasAnyTransition) {
      window.requestAnimationFrame(() => { this.updateAndDrawGameBoard() });
    } else {
      this.showing_transition = false;
    }

    // On appelle les callbacks qui ont eu lieu dans les transitions.
    for (let gameCallback of mergedGameUpdateResult.callbackInsideTransi) {
      this.execGameCallback(gameCallback);
    }
    // On appelle les callbacks de fin de transitions, si il y en a eu.
    for (let gameCallback of mergedGameUpdateResult.callbackEndTransi) {
      this.execGameCallback(gameCallback);
    }
    if (this.hasUiLockTypeChanged(mergedGameUpdateResult.uiBlock)) {
      this.refreshUiLockType();
    }
  }

  // Les méthodes ci-dessous sont privées.
  // Il est possible de l'indiquer "officiellement", avec la syntaxe #private :
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties
  // Sauf que c'est pas supporté par tous les navigateurs, alors je prends pas le risque.

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

  afterGameEvent(eventResultRaw) {
    let mustRedraw = true;
    if (!this.isNonePython(eventResultRaw)) {
      mustRedraw = this.processGameEventResult(eventResultRaw);
    }
    this.updateFromPythonData(mustRedraw);
  }

  processGameEventResult(eventResultRaw) {
    //console.log("eventResultRaw");
    //console.log(eventResultRaw);
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
          // le javascript va considérer que c'est True. Ce qui ne correspond pas à la pensée pythonienne.
          // En même temps, faudrait être tordu pour faire ça.
          mustRedraw = false;
        }
      }
    }
    return mustRedraw;
  }

  // TODO : bug a tracer dans trello. Les callbacks sont pas annulées quand on recharge un jeu.
  // lancer une boule de feu avec le jeu du sorcier, puis cliquer sur le jeu des diamants.
  // Ça fait un message d'erreur.

  // TODO : si on clique sur Exécuter alors que y'a des transitions en cours,
  // ça continue d'afficher les images d'avant.
  // À cause de ce qu'on a balancé dans requestAnimationFrame, et qui est toujours là.
  // faudra exécuter ça : https://developer.mozilla.org/fr/docs/Web/API/Window/cancelAnimationFrame

  // TODO : plein de variables nommées en snake case à remettre en camel,
  // à cause des conventions dégueux du javascript de mes fesses.

}
