import { Direction, PlayerLockTransi } from './common/Constants.js';
import { isNonePython } from './common/SimpleFunctions.js';


const actionsFromPlayer = ['U', 'R', 'D', 'L', 'action_1', 'action_2'];
const defaultTileSize = 32;
const defaultNbTileWidth = 20;
const defaultNbTileHeight = 14;


export default class GameEngineV1 {

  constructor(
    python_console,
    pyodide,
    onAfterGameEvent,
    game_canvas,
    canvas_buffer,
    libSquarityCode
  ) {
    this.version = "1.0.0";
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

    this.eventNameFromJsDir = new Map();
    this.eventNameFromJsDir.set(Direction.Up, 'U');
    this.eventNameFromJsDir.set(Direction.Right, 'R');
    this.eventNameFromJsDir.set(Direction.Down, 'D');
    this.eventNameFromJsDir.set(Direction.Left, 'L');

    this.delayed_actions = [];
    this.has_click_handling = false;
    this.configGameSizes(defaultTileSize, defaultNbTileWidth, defaultNbTileHeight);

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

  getPlock() {
    if (this.isPlayerLocked()) {
      return PlayerLockTransi.Lock;
    } else {
      return PlayerLockTransi.NoLock;
    }
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
      'game_model = GameModel()',
      'Instanciation du GameModel',
    );
    // Vérification si ce game code a une fonction qui gère les clics.
    this.has_click_handling = this.runPython(
      'hasattr(game_model, "on_click")',
      'Vérification de la présence de on_click',
    );
  }

  execStartCode() {
    // La v1 ne peut pas définir de start code.
    // Il faut tout mettre dans la fonction __init__.
    // Alors on fait juste un update, et au revoir.
    this.updateFromPythonData(true);
  }

  onButtonDirection(direction) {
      if (this.isPlayerLocked()) {
        return;
      }
      const eventName = this.eventNameFromJsDir.get(direction);
      this.sendGameEvent(eventName);
  }

  onButtonAction(actionName) {
    if (this.isPlayerLocked()) {
      return;
    }
    this.sendGameEvent(actionName);
  }

  sendGameEvent(eventName) {
    if (this.isPlayerLocked() && actionsFromPlayer.includes(eventName)) {
      return;
    }
    const eventResultRaw = this.runPython(
      `game_model.on_game_event("${eventName}")`,
      `Exécution d'un événement ${eventName}`,
    );
    let mustRedraw = true;
    if (!isNonePython(eventResultRaw)) {
      mustRedraw = this.processGameEventResult(eventResultRaw);
    }
    this.updateFromPythonData(mustRedraw);
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
    if (!isNonePython(eventResultRaw)) {
      mustRedraw = this.processGameEventResult(eventResultRaw);
    }
    this.updateFromPythonData(mustRedraw);
    this.onAfterGameEvent();
  }

  updateFromPythonData(mustRedraw) {
    if (!mustRedraw) {
      return;
    }
    // J'ai tenté clearRect. Mais ça ne marche pas bien.
    // Mon bonhomme reste dessiné sur les cases noires. Osef.
    this.ctx_canvas_buffer.fillRect(
      0, 0,
      this.game_canvas.width, this.game_canvas.height
    );
    let canvasX = 0;
    let canvasY = 0;
    const tilesData = this.runPython(
      'game_model.export_all_tiles()',
      'Récupération des tiles pour les dessiner',
    );

    for (let y = 0; y < this.nb_tile_height; y += 1) {
      for (let x = 0; x < this.nb_tile_width; x += 1) {
        const tileData = tilesData[y][x];
        for (let i = 0; i < tileData.length; i += 1) {
          const gameObject = tileData[i];
          const [coordImgX, coordImgY] = this.img_coords[gameObject];
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
    this.ctx_canvas.drawImage(this.canvas_buffer, 0, 0);
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

  printGameConsole(msg) {
    const pythonConsole = this.python_console;
    pythonConsole.textContent += msg;
    pythonConsole.scrollTop = pythonConsole.scrollHeight;
  }

  processDelayedAction(timeOutIdProcessing, eventName) {
    this.delayed_actions = this.delayed_actions.filter((eventId) => eventId !== timeOutIdProcessing);
    this.sendGameEvent(eventName);
  }

  processGameEventResult(eventResultRaw) {
    // Exemple d'infos à processer :
    // {
    //   "delayed_actions": [
    //       {"name": "blabla", "delay_ms": 500},
    //       {"name": "blabla2", "delay_ms": 250}
    //   ],
    //   "redraw: 0,"
    //   "player_locks": ["name1", "name2"],
    //   "player_unlocks": ["name1", "name2", "*"],
    // }
    let mustRedraw = true;
    const eventResult = JSON.parse(eventResultRaw);
    if ('delayed_actions' in eventResult) {
      for (let newDelayedAction of eventResult.delayed_actions) {
        let delayTime = 500;
        if ('delay_ms' in newDelayedAction) {
          delayTime = newDelayedAction.delay_ms;
        }
        if ('name' in newDelayedAction) {
          // On peut utiliser l'identifiant renvoyé par setTimeout
          // à l'intérieur de la fonction callback du setTimeout.
          // Ça a l'air complètement fumé mais ça marche ... Magie JavaScript !!!
          // https://stackoverflow.com/questions/17280375/in-javascript-how-can-i-access-the-id-of-settimeout-setinterval-call-from-insid
          const timeOutId = setTimeout(() => {
            this.processDelayedAction(timeOutId, newDelayedAction.name);
          }, delayTime);
          this.delayed_actions.push(timeOutId);
        }
      }
    }
    if ('player_locks' in eventResult) {
      for (let lockName of eventResult.player_locks) {
        if (!this.player_locks.includes(lockName)) {
          this.player_locks.push(lockName);
        }
      }
    }
    if ('player_unlocks' in eventResult) {
      for (let unlockName of eventResult.player_unlocks) {
        if (unlockName === '*') {
          this.player_locks = [];
        } else {
          this.player_locks = this.player_locks.filter((lockLoop) => lockLoop !== unlockName);
        }
      }
    }
    if ('redraw' in eventResult) {
      mustRedraw = eventResult.redraw !== 0;
    }
    return mustRedraw;
  }

}
