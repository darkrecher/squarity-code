const DEFAULT_TILE_SIZE = 32;
const DEFAULT_NB_TILE_WIDTH = 20;
const DEFAULT_NB_TILE_HEIGHT = 14;


export default class GameJsonConfig {

  constructor(strJsonConf) {
    this.strJsonConf = strJsonConf;
    this.gameName = "";
    this.strVersion = "";
    this.majorVersion = null;
    this.mustInferVersion = true;
    this.tileSizePixel = DEFAULT_TILE_SIZE;
    this.nbTileWidth = DEFAULT_NB_TILE_WIDTH;
    this.nbTileHeight = DEFAULT_NB_TILE_HEIGHT;
    this.imgCoords = null;
    this.showCodeAtStart = true;
    this.showGameDescriptionAtStart = false;
    this.gameDescription = "";
    this.gameNotes = "";
  }

  processJsonConf() {

    this.config = JSON.parse(this.strJsonConf);

    // https://caniuse.com/?search=operator%3A%20in - 97%
    if ('name' in this.config) {
      this.gameName = this.config.name;
    }
    if ('version' in this.config) {
      this.strVersion = this.config.version;
      if (this.strVersion[0] == '1') {
        this.majorVersion = 1;
        this.mustInferVersion = false;
      } else if (this.strVersion[0] == '2') {
        this.majorVersion = 2;
        this.mustInferVersion = false;
      }
    }

    if ('tile_size' in this.config) {
      this.tileSizePixel = this.config.tile_size;
    }
    if ('game_area' in this.config) {
      const gameArea = this.config.game_area;
      if ('nb_tile_width' in gameArea) {
        this.nbTileWidth = gameArea.nb_tile_width;
      }
      if ('w' in gameArea) {
        this.nbTileWidth = gameArea.w;
      }
      if ('nb_tile_height' in gameArea) {
        this.nbTileHeight = gameArea.nb_tile_height;
      }
      if ('h' in gameArea) {
        this.nbTileHeight = gameArea.h;
      }
    }

    this.imgCoords = this.config.img_coords;

    if ('show_code_at_start' in this.config) {
      this.showCodeAtStart = this.config['show_code_at_start'];
    }
    if ('texts' in this.config) {
      const textsConfig = this.config['texts'];
      if ('description' in textsConfig) {
        this.gameDescription = textsConfig['description'];
      }
      if ('show_desc_at_start' in textsConfig) {
        this.showGameDescriptionAtStart = textsConfig['show_desc_at_start'];
      }
    }

  }

  getDocumentTitle() {
    if (this.gameName) {
      return `Squarity - ${this.gameName}`;
    } else {
      return 'Squarity';
    }
  }

}