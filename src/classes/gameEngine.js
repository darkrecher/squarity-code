const actionsFromPlayer = ['U', 'R', 'D', 'L', 'action_1', 'action_2'];

export default class GameEngine {

  constructor(
    python_console,
    pyodide,
    onAfterGameEvent,
    game_canvas,
    ctx_canvas,
    ctx_canvas_buffer,
    canvas_buffer
  ) {
    this.python_console = python_console;
    this.pyodide = pyodide;
    this.onAfterGameEvent = onAfterGameEvent;
    this.game_canvas = game_canvas;
    this.ctx_canvas = ctx_canvas;
    this.ctx_canvas_buffer = ctx_canvas_buffer;
    this.canvas_buffer = canvas_buffer;

    this.delayed_actions = [];
    this.has_click_handling = false;
  }

  isPlayerLocked() {
    return (this.player_locks.length !== 0);
  }

  getRatioFromWidthToHeight() {
    return this.canvas_height / this.canvas_width;
  }

  updateGameSpec(gameCode, tile_atlas, img_coords) {
    this.img_coords = img_coords;
    this.tile_atlas = tile_atlas;

    // On remet à zéro toutes les infos concernant les delayed actions.
    for (let delayedActionInfo of this.delayed_actions) {
      const [timeoutId] = delayedActionInfo;
      clearTimeout(timeoutId);
    }

    this.player_locks = [];
    this.delayed_action_next_id = 0;
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
    this.has_click_handling = false;
    let resultPython = null;
    try {
      resultPython = this.pyodide.runPython('game_model.on_click');
    } catch (err) {
      resultPython = null;
    }
    if (resultPython != null) {
      this.has_click_handling = true;
    }
  }

  sendGameEvent(eventName) {
    // Exemple d'infos à récupérer :
    // {
    //   "delayed_actions": [
    //       {"name": "blabla", "delay_ms": 500},
    //       {"name": "blabla2", "delay_ms": 250}
    //   ],
    //   "redraw: 0,"
    //   "player_locks": ["name1", "name2"],
    //   "player_unlocks": ["name1", "name2", "*"],
    // }
    if (this.isPlayerLocked() && actionsFromPlayer.includes(eventName)) {
      return;
    }
    const eventResultRaw = this.runPython(
      `game_model.on_game_event("${eventName}")`,
      `Exécution d'un événement ${eventName}`,
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
    // J'ai tenté clearRect. Mais ça ne marche pas bien.
    // Mon bonhomme reste dessiné sur les cases noires. Osef.
    this.ctx_canvas_buffer.fillRect(0, 0, 640, 448);
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

  // TODO : devrait être privée, mais ça l'est pas.
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

  // TODO : devrait être privée, mais ça l'est pas.
  configGameSizes(tileSize, nbTileWidth, nbTileHeight) {
    // Définition de la taille interne du canvas (canvasElem) et de la taille de la zone de dessin
    // (this.canvas_buffer). C'est la même taille pour les deux, mais ça ne correspond pas
    // à la taille réelle du canvas dans le DOM. Cette taille réelle est définie
    // à un autre endroit du code (et de manière assez inavouable) (voir handleResize).
    this.tile_canvas_width = tileSize;
    this.tile_canvas_height = tileSize;
    this.tile_img_width = tileSize;
    this.tile_img_height = tileSize;
    this.nb_tile_width = nbTileWidth;
    this.nb_tile_height = nbTileHeight;
    this.canvas_width = this.nb_tile_width * this.tile_canvas_width;
    this.canvas_height = this.nb_tile_height * this.tile_canvas_height;

    const canvasElem = this.game_canvas;
    canvasElem.width = this.canvas_width;
    canvasElem.height = this.canvas_height;
    this.canvas_buffer.width = this.canvas_width;
    this.canvas_buffer.height = this.canvas_height;
  }

  // TODO : c'est vraiment privée, et toutes les méthodes qui suivent aussi.
  // mais je sais plus comment on dit ça explicitement en javascript.
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

  processDelayedAction(actionId) {
    // https://github.com/babel/babel-eslint/issues/274
    const delayedActionInfo = this.delayed_actions.find(([, actId]) => actId === actionId);
    if (delayedActionInfo) {
      this.delayed_actions = this.delayed_actions.filter(([, actId]) => actId !== actionId);
      const [, , eventName] = delayedActionInfo;
      this.sendGameEvent(eventName);
    }
  }

  processGameEventResult(eventResultRaw) {
    let mustRedraw = true;
    const eventResult = JSON.parse(eventResultRaw);
    if ('delayed_actions' in eventResult) {
      for (let newDelayedAction of eventResult.delayed_actions) {
        let delayTime = 500;
        if ('delay_ms' in newDelayedAction) {
          delayTime = newDelayedAction.delay_ms;
        }
        if ('name' in newDelayedAction) {
          const actionName = newDelayedAction.name;
          // TODO : C'est quoi cet id incrémental de déglingué ?
          // Faudra se débarrasser de ça.
          const newActionId = this.delayed_action_next_id;
          this.delayed_action_next_id += 1;
          const timeOutId = setTimeout(() => {
            this.processDelayedAction(newActionId);
          }, delayTime);
          const newDelayedActionInfo = [timeOutId, newActionId, actionName];
          this.delayed_actions.push(newDelayedActionInfo);
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
