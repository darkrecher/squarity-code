const DEFAULT_TILE_SIZE = 32;
const DEFAULT_NB_TILE_WIDTH = 20;
const DEFAULT_NB_TILE_HEIGHT = 14;


export default class GameJsonConfig {

  constructor(strJsonConf) {
    this.strJsonConf = strJsonConf;
    this.gameName = "";
    this.strVersion = "";
    this.majorVersion = null;
    this.majorVersionOK = false;
    this.tileSizePixel = DEFAULT_TILE_SIZE;
    this.nbTileWidth = DEFAULT_NB_TILE_WIDTH;
    this.nbTileHeight = DEFAULT_NB_TILE_HEIGHT;
    this.imgCoords = null;
    this.showCodeAtStart = true;
    this.showGameDescriptionAtStart = false;
    this.gameDescription = "";
    this.gameDescripImageUrl = "";
    this.footNotes = "";
  }

  processJsonConf() {

    this.config = JSON.parse(this.strJsonConf);

    // https://caniuse.com/?search=operator%3A%20in - 97%
    if ('name' in this.config) {
      this.gameName = this.config.name;
    }
    if ('version' in this.config) {
      this.strVersion = String(this.config.version);
      // https://stackoverflow.com/questions/9133102/how-to-grab-substring-before-a-specified-character-in-javascript
      let strMajorVersion = this.strVersion.split('.')[0];
      if (strMajorVersion == '1') {
        this.majorVersion = 1;
        this.majorVersionOK = true;
      } else if (strMajorVersion == '2') {
        this.majorVersion = 2;
        this.majorVersionOK = true;
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
    if ('appendices' in this.config) {
      const appenConfig = this.config['appendices'];
      if ('descrip_text' in appenConfig) {
        this.gameDescription = appenConfig['descrip_text'];
      }
      if ('descrip_img' in appenConfig) {
        this.gameDescripImageUrl = appenConfig['descrip_img'];
      }
      if ('show_descrip_at_start' in appenConfig) {
        this.showGameDescriptionAtStart = appenConfig['show_descrip_at_start'];
      }
      if ('footnotes' in appenConfig) {
        this.footNotes = appenConfig['footnotes'];
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

  getDescriptionTitle() {
    if (this.gameName) {
      return this.gameName;
    } else {
      return 'Squarity';
    }
  }

}