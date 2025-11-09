import { isNonePython } from './common/SimpleFunctions.js';
import { Direction, PlayerLockTransi } from './common/Constants.js';
import { imgAnchor, LayerWithTransition, LayerNoTransition } from './gameEngine/Layer.js';
import GameUpdateResult from './gameEngine/GameUpdateResult.js'


export default class GameEngineV2 {

  constructor(
    pythonConsole,
    pyodide,
    refreshPlock,
    gameCanvas,
    canvasBuffer,
    libSquarityCode
  ) {
    this.version = "2.1.0";
    this.pythonConsole = pythonConsole;
    this.pyodide = pyodide;
    this.refreshPlock = refreshPlock;
    this.gameCanvas = gameCanvas;
    this.canvasBuffer = canvasBuffer;
    this.ctxCanvas = this.gameCanvas.getContext('2d');
    this.ctxCanvasBuffer = this.canvasBuffer.getContext('2d');
    // https://stackoverflow.com/questions/2795269/does-html5-canvas-support-double-buffering
    // clear canvas
    this.ctxCanvasBuffer.fillStyle = '#000000';

    this.layers = null;
    // mapLayers contient des objets Layer.
    this.mapLayers = new Map();
    // orderedLayers contient les Layers, dans l'ordre d'affichage.
    // On a les mêmes objets dans les values de mapLayers et dans orderedLayers.
    this.orderedLayers = [];
    this.delayedCallbacks = [];
    this.hasClickHandling = false;
    this.showingTransition = false;
    this.plocksCustom = [];
    this.currentPlock = PlayerLockTransi.NoLock;

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

    // https://stackoverflow.com/questions/31910043/html5-canvas-drawimage-draws-image-blurry
    this.ctxCanvas.imageSmoothingEnabled = false;
    this.ctxCanvasBuffer.imageSmoothingEnabled = false;
  }

  hasPlockChanged(newPlockTransi) {
    let newPlock = PlayerLockTransi.NoLock;
    if (newPlockTransi == PlayerLockTransi.Invisible) {
      newPlock = PlayerLockTransi.Invisible;
    } else if ((this.plocksCustom.length !== 0) || (newPlockTransi === PlayerLockTransi.Lock)) {
      newPlock = PlayerLockTransi.Lock;
    }
    if (this.currentPlock !== newPlock) {
      this.currentPlock = newPlock;
      return true
    } else {
      return false;
    }
  }

  getPlock() {
    return this.currentPlock;
  }

  updateGameSpec(tileAtlas, gameJsonConfig, gameCode) {

    this.configGameSizes(
      gameJsonConfig.tileSizePixel,
      gameJsonConfig.nbTileWidth,
      gameJsonConfig.nbTileHeight
    );
    this.atlasDefinitions = this.computeAtlasDefinitions(
      gameJsonConfig.imgCoords,
      gameJsonConfig.tileSizePixel
    );
    this.tileAtlas = tileAtlas;

    // On annule toutes les delayed callbacks du jeu précédent.
    for (let timeoutId of this.delayedCallbacks) {
      clearTimeout(timeoutId);
    }
    this.plocksCustom = [];
    this.currentPlock = PlayerLockTransi.NoLock;
    this.delayedCallbacks = [];

    this.runPython(
      gameCode,
      'Interprétation du gameCode.',
    );
    document.json_conf = gameJsonConfig.strJsonConf;
    this.runPython(
      `game_model = GameModel(${gameJsonConfig.nbTileWidth}, ${gameJsonConfig.nbTileHeight}, ${gameJsonConfig.tileSizePixel}, js.document.json_conf)`,
      'Instanciation du GameModel',
    );
    // FUTURE: meuh... Y'a pas plus simple pour récupérer ce truc ?
    this.gameModel = this.runPython(
      `game_model`,
      'Récupération du game_model',
    );
    // Vérification si ce game code a une fonction qui gère les clics.
    this.hasClickHandling = this.runPython(
      'hasattr(game_model, "on_click")',
      'Vérification de la présence de on_click',
    );
  }

  computeAtlasDefinitions(jsonImgCoords, tileSize) {
    const atlasDefinitions = new Map();
    // Pour parcourir les clés d'un objet provenant d'un dictionnaire json.
    // (En espérant que ça me pète pas à la gueule avec des clés qui proviennent pas de mon json,
    // parce qu'il y a des gens qui le vérifient avec "hasOwnProperty", mais ça fait râler le linter)
    // https://stackoverflow.com/questions/37673454/javascript-iterate-key-value-from-json
    for (const spriteName of Object.keys(jsonImgCoords)) {
      // spriteDefCoords doit contenir 7 valeurs :
      //  - Coordonnées x et y du coin supérieur gauche de l'image, dans l'atlas
      //    (la grosse image principale contenant toutes les images du jeu)
      //  - Taille (largeur, hauteur) de l'image à afficher, dans l'atlas.
      //    optionel. Par défaut, on prend la taille par défaut.
      //    C'est à dire celle indiquée dans le json de config : la valeur "tile_size".
      //    On décalera un peu l'image par rapport cette taille, pour que le centre de la tile dans l'aire de jeu
      //    corresponde au centre de l'image dans l'atlas.
      //    On peut faire que ces deux centres ne se correspondent plus, en appliquant un décalage
      //    (voir les 2 valeurs suivantes).
      //  - Anchor. valeur imgAnchor.CORNER_UPLEFT ou imgAnchor.CENTER.
      //    Ça indique où placer l'image lorsqu'elle est agrandie/rétrécie.
      //    Si c'est CORNER_UPLEFT, le coin haut gauche de l'image reste fixé sur le coin haut gauche de la tile.
      //    Si c'est CENTER, le centre de l'image reste fixé sur le centre de la tile.
      //    Par défaut : CORNER_UPLEFT.
      //  - Facteur de scale à appliquer dans l'aire de jeu. C'est juste la taille en pixel de l'image d'atlas,
      //    divisée par la taille d'une tile dans l'aire de jeu.
      //    Elle n'est pas indiquée dans le json de config. Elle est présente juste parce qu'on peut la précalculer.
      // FUTURE : on pourrait avoir d'autres point d'ancrage : corner_up_right, etc. ou des points d'ancrage en coordonnées.
      // FUTURE : faire des petits schémas dans une doc à part, pour que ce soit plus clair.
      let spriteDefCoords = jsonImgCoords[spriteName];

      if (spriteDefCoords.length < 3) {
        spriteDefCoords.push(tileSize);
      }
      if (spriteDefCoords.length < 4) {
        spriteDefCoords.push(tileSize);
      }
      if (spriteDefCoords.length < 5) {
        spriteDefCoords.push(imgAnchor.CORNER_UPLEFT);
      } else {
        let imgAnchorVal;
        if (spriteDefCoords[4] == "center") {
          imgAnchorVal = imgAnchor.CENTER;
        } else {
          imgAnchorVal = imgAnchor.CORNER_UPLEFT;
        }
        spriteDefCoords.pop();
        spriteDefCoords.push(imgAnchorVal);
      }

      const tileInAtlasWidth = spriteDefCoords[2];
      const scaleAtlasWidth = tileInAtlasWidth / this.tileImgWidth;
      spriteDefCoords.push(scaleAtlasWidth);
      const tileInAtlasHeight = spriteDefCoords[3];
      const scaleAtlasHeight = tileInAtlasHeight / this.tileImgHeight;
      spriteDefCoords.push(scaleAtlasHeight);
      atlasDefinitions.set(spriteName, spriteDefCoords);
    }
    return atlasDefinitions;
  }

  execStartCode() {
    let eventResultRaw;

    try {
      eventResultRaw = this.gameModel.on_start();
    } catch (err) {
      const errMessage = err.message;
      this.printGameConsole(`Erreur python durant l'exécution de game_model.on_start\n${errMessage}`);
      // Au début, j'avais l'intention de rethrower l'exception.
      // Mais si je fais ça, l'erreur ne s'affiche pas dans la zone de texte de la page web.
      // Donc je re throw pas, et c'est tout.
      // Par contre, ça marche pour les autres fonctions. C'est vraiment zarb, le JS.
    }

    this.afterGameEvent(eventResultRaw);
  }

  onButtonDirection(direction) {
    if (this.currentPlock) {
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
    if (this.currentPlock) {
      return;
    }
    let eventResultRaw;
    try {
      eventResultRaw = this.gameModel.on_button_action(actionName);
    } catch (err) {
      const errMessage = err.message;
      this.printGameConsole(`Erreur python durant l'exécution de '${actionName}'.\n${errMessage}`);
      throw err;
    }
    this.afterGameEvent(eventResultRaw);
  }

  execGameCallback(gameCallback) {
    let eventResultRaw;
    try {
      eventResultRaw = gameCallback();
    } catch (err) {
      const errMessage = err.message;
      this.printGameConsole(`Erreur python durant l'exécution d'une callback\n${errMessage}`);
      throw err;
    }
    this.afterGameEvent(eventResultRaw);
  }

  onGameClick(e) {
    if (!this.hasClickHandling) {
      return;
    }
    if (this.currentPlock) {
      return;
    }
    // https://thewebdev.info/2021/03/21/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/
    const rect = this.gameCanvas.getBoundingClientRect();
    const clickedTileX = Math.floor((e.offsetX * this.nbTileWidth) / rect.width);
    const clickedTileY = Math.floor((e.offsetY * this.nbTileHeight) / rect.height);
    if (
      !(
        (clickedTileX >= 0)
        && (clickedTileX < this.nbTileWidth)
        && (clickedTileY >= 0)
        && (clickedTileY < this.nbTileHeight)
      )
    ) {
      return;
    }
    // FUTURE: si je pouvais récupérer Coord,
    // j'aurais pas besoin d'exécuter ça avec une string pourrie.
    const eventResultRaw = this.runPython(
      `game_model.on_click(squarity.Coord(${clickedTileX}, ${clickedTileY}))`,
      `Exécution de on_click sur (${clickedTileX}, ${clickedTileX})`,
    );
    this.afterGameEvent(eventResultRaw);
  }

  updateFromPythonData(mustRedraw) {

    const timeNow = performance.now();
    this.orderedLayers = []

    for (let pythonLayer of this.gameModel.layers) {
      const layerId = pythonLayer._l_id;
      if (!this.mapLayers.has(layerId)) {
        let newLayer;
        // FUTURE : grand mystère. Je dois remettre cette instruction ici, sinon ce n'est pas pris en compte.
        // Pourtant, je l'ai dit dès le début, dans le constructeur de cette classe.
        this.ctxCanvasBuffer.imageSmoothingEnabled = false;
        if (pythonLayer.show_transitions) {
          newLayer = new LayerWithTransition(
            pythonLayer,
            this.gameModel,
            this.atlasDefinitions,
            this.ctxCanvasBuffer,
            this.tileAtlas,
            this.tileImgWidth, this.tileImgHeight,
            this.tileCanvasWidth, this.tileCanvasHeight,
          );
        } else {
          newLayer = new LayerNoTransition(
            pythonLayer,
            this.gameModel,
            this.atlasDefinitions,
            this.ctxCanvasBuffer,
            this.tileAtlas,
            this.tileImgWidth, this.tileImgHeight,
            this.tileCanvasWidth, this.tileCanvasHeight,
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

    if (mustRedraw) {
      // On dessine l'état actuel. Faut tout redessiner.
      this.drawCurrentGameBoardState(timeNow)
    }
    // On regarde si des nouvelles transitions ont été ajoutées.
    // Si oui, on demande un nouvel affichage de l'aire de jeu, "pour la prochaine fois".
    if (gameUpdateResult.addedTransitions) {
      // Mais avant de demander un nouvel affichage, on vérifie qu'on n'est pas déjà en train
      // de faire des transitions, et donc d'afficher périodiquement l'état du jeu.
      // Si c'est le cas, pas la peine de redemander un affichage en plus.
      if (!this.showingTransition) {
        window.requestAnimationFrame(() => { this.updateAndDrawGameBoard() });
        this.showingTransition = true;
      }
    }
    if (this.hasPlockChanged(gameUpdateResult.PlockTransi)) {
      this.refreshPlock();
    }
  }

  drawCurrentGameBoardState(timeNow) {
    // J'ai tenté clearRect. Mais ça ne marche pas bien.
    // Mon bonhomme reste dessiné sur les cases noires. Osef.
    this.ctxCanvasBuffer.fillRect(
      0, 0,
      this.gameCanvas.width, this.gameCanvas.height
    );
    for (let layer of this.orderedLayers) {
      layer.draw(timeNow);
    }
    this.ctxCanvas.drawImage(this.canvasBuffer, 0, 0);
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
      this.showingTransition = false;
    }

    // On appelle les callbacks qui ont eu lieu dans les transitions.
    for (let gameCallback of mergedGameUpdateResult.callbackInsideTransi) {
      this.execGameCallback(gameCallback);
    }
    // On appelle les callbacks de fin de transitions, si il y en a eu.
    for (let gameCallback of mergedGameUpdateResult.callbackEndTransi) {
      this.execGameCallback(gameCallback);
    }
    if (this.hasPlockChanged(mergedGameUpdateResult.PlockTransi)) {
      this.refreshPlock();
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
      this.printGameConsole(`Erreur python durant : \n${codeLabel}\n${errMessage}`);
      // Je rethrow l'exception, parce que si le code python déconne,
      // vaut mieux pas essayer de faire d'autres choses après.
      throw err;
    }
    return resultPython;
  }

  configGameSizes(tileSize, nbTileWidth, nbTileHeight) {
    // Définition de la taille interne du canvas (canvasElem) et de la taille de la zone de dessin
    // (this.canvasBuffer). C'est la même taille pour les deux, mais ça ne correspond pas
    // à la taille réelle du canvas dans le DOM. Cette taille réelle est définie
    // à un autre endroit du code (et de manière assez inavouable) (voir GameBoard.handleResize).
    this.tileCanvasWidth = tileSize;
    this.tileCanvasHeight = tileSize;
    this.tileImgWidth = tileSize;
    this.tileImgHeight = tileSize;
    this.nbTileWidth = nbTileWidth;
    this.nbTileHeight = nbTileHeight;
    const canvasWidth = this.nbTileWidth * this.tileCanvasWidth;
    const canvasHeight = this.nbTileHeight * this.tileCanvasHeight;

    this.gameCanvas.width = canvasWidth;
    this.gameCanvas.height = canvasHeight;
    this.canvasBuffer.width = canvasWidth;
    this.canvasBuffer.height = canvasHeight;
  }

  printGameConsole(msg) {
    const pythonConsole = this.pythonConsole;
    pythonConsole.textContent += msg;
    pythonConsole.scrollTop = pythonConsole.scrollHeight;
  }

  processDelayedCallback(timeOutIdProcessing, gameCallback) {
    this.delayedCallbacks = this.delayedCallbacks.filter((eventId) => eventId !== timeOutIdProcessing);
    this.execGameCallback(gameCallback);
  }

  afterGameEvent(eventResultRaw) {
    let mustRedraw = true;
    if (!isNonePython(eventResultRaw)) {
      mustRedraw = this.processGameEventResult(eventResultRaw);
    }
    this.updateFromPythonData(mustRedraw);
  }

  processGameEventResult(eventResultRaw) {
    let mustRedraw = true;
    for (let newDelayedCallback of eventResultRaw.delayed_callbacks) {
      let delayTime = 0;
      if (newDelayedCallback.delay) {
        delayTime = newDelayedCallback.delay;
      }
      if (newDelayedCallback.callback) {
        // On peut utiliser l'identifiant renvoyé par setTimeout
        // à l'intérieur de la fonction callback du setTimeout.
        // Ça a l'air complètement fumé mais ça marche ... Magie JavaScript !!!
        // https://stackoverflow.com/questions/17280375/in-javascript-how-can-i-access-the-id-of-settimeout-setinterval-call-from-insid
        const timeOutId = setTimeout(() => {
          this.processDelayedCallback(timeOutId, newDelayedCallback.callback);
        }, delayTime);
        this.delayedCallbacks.push(timeOutId);
      }
    }
    if (eventResultRaw.plocks_custom) {
      for (let plockCustomName of eventResultRaw.plocks_custom) {
        if (!this.plocksCustom.includes(plockCustomName)) {
          this.plocksCustom.push(plockCustomName);
        }
      }
    }
    if (eventResultRaw.punlocks_custom) {
      for (let punlockCustomName of eventResultRaw.punlocks_custom) {
        if (punlockCustomName === '*') {
          this.plocksCustom = [];
        } else {
          this.plocksCustom = this.plocksCustom.filter((plockLoop) => plockLoop !== punlockCustomName);
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

}
