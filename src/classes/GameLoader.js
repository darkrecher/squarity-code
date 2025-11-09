// Ça marche pas pastebin. Même avec le proxy de cors. On laisse tomber ça pour l'instant.
const URL_PATTERN_PASTEBIN = 'https://cors-anywhere.herokuapp.com/http://pastebin.com/raw/{externalId}'
const URL_PATTERN_GITHUBGIST = 'https://gist.githubusercontent.com/{externalId}'
const URL_PATTERN_EXAMPLES = '/gamedata/examples/{externalId}.txt'
const URL_PATTERN_TUTORIALS = '/gamedata/tutorials/{externalId}.txt'


class gameSpec {
  constructor(urlTileset, jsonConf, gameCode) {
    this.urlTileset = urlTileset;
    this.jsonConf = jsonConf;
    this.gameCode = gameCode;
    this.originLocHash = "";
  }
  setOriginLocHash(originLocHash) {
    this.originLocHash = originLocHash;
  }
}


export default Object.freeze({

  gameSpec: gameSpec,

  urlGameFromLocHash(locHash) {
    // Le paramètre "limit" ne redonne pas toute la fin de la string...
    const locHashSplitted = locHash.split('_');
    if (locHashSplitted.length < 3) {
      return null;
    }
    const [prefix, locCategory, ...externalIdParts] = locHashSplitted;
    if (prefix !== '#fetchez') {
      return null;
    }
    let urlPattern = '';
    let regexExternalId = /^[0-9a-zA-Z/\\._-]+$/;
    const externalId = externalIdParts.join("_");

    if (locCategory === 'pastebin') {
      urlPattern = URL_PATTERN_PASTEBIN;
      regexExternalId = /^[0-9a-zA-Z]+$/;
    } else if (locCategory === 'githubgist') {
      urlPattern = URL_PATTERN_GITHUBGIST;
    } else if (locCategory === 'example') {
      urlPattern = URL_PATTERN_EXAMPLES;
    } else if (locCategory === 'tutorial') {
      urlPattern = URL_PATTERN_TUTORIALS;
    }
    if (!urlPattern) {
      return null;
    }
    if (!externalId.match(regexExternalId)) {
      return null;
    }

    return urlPattern.replace('{externalId}', externalId);
  },

  async fetchGameDetails(url) {
    // https://stackoverflow.com/questions/57411402/using-fetch-to-display-plain-text-in-a-web-page
    let response = '';
    try {
      response = await fetch(url);
    } catch (error) {
      return null;
    }
    const dataText = await response.text();
    // On parse selon le format décrit ici :
    // https://github.com/darkrecher/squarity-doc/blob/master/user_manual/share_your_game.md
    const dataLines = dataText.split('\n', 3);
    if (dataLines.length < 2) {
      return null;
    }
    const urlTileset = dataLines[0];
    // Il faut que ce soit exactement la même ligne entre celle qui fait la séparation entre
    // l'url et la conf json, et celle qui fait la séparation entre la conf json et le gamecode.
    // Aux espaces près ! (Donc le mieux est de pas mettre d'espace du tout).
    const separator = dataLines[1];
    const gameSpecElems = dataText.split(`\n${separator}\n`, 3);
    if (gameSpecElems.length !== 3) {
      return null;
    }
    const jsonConf = gameSpecElems[1];
    const gameCode = gameSpecElems[2];
    return {
      urlTileset: urlTileset,
      jsonConf: jsonConf,
      gameCode: gameCode,
    };
  },

  getDefaultGameUrl() {
    return this.URL_PATTERN_EXAMPLES.replace('{externalId}', 'magician');
  },

});
