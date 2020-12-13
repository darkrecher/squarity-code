const axios = require('axios');

export default Object.freeze({

  // Ça marche pas pastebin.Même avec le proxy de cors. On laisse tomber ça pour l'instant.
  URL_PATTERN_PASTEBIN: 'https://cors-anywhere.herokuapp.com/http://pastebin.com/raw/{externalId}',
  URL_PATTERN_GITHUBGIST: 'https://gist.githubusercontent.com/{externalId}',

  url_game_spec_from_loc_hash(locHash) {
    const locHashSplitted = locHash.split('_');
    if (locHashSplitted.length !== 3) {
      return null;
    }
    if (locHashSplitted[0] !== '#fetchez') {
      return null;
    }
    let urlPattern = '';
    const externalId = locHashSplitted[2];

    if (locHashSplitted[1] === 'pastebin') {
      urlPattern = this.URL_PATTERN_PASTEBIN;
      if (!externalId.match(/^[0-9a-zA-Z]+$/)) {
        return null;
      }
    } else if (locHashSplitted[1] === 'githubgist') {
      urlPattern = this.URL_PATTERN_GITHUBGIST;
      if (!externalId.match(/^[0-9a-zA-Z/._-]+$/)) {
        return null;
      }
    }
    if (!urlPattern) {
      return null;
    }
    return urlPattern.replace('{externalId}', externalId);
  },

  async fetch_game_spec(url) {
    let response = '';
    try {
      response = await axios.get(url);
    } catch (error) {
      return null;
    }
    // On parse selon le format décrit ici :
    // https://trello.com/c/pbxgBITh/44-%C3%A9crire-la-documentation-utilisateur
    // Ce sera dans une vraie doc plus tard.
    const dataLines = response.data.split('\n', 3);
    if (dataLines.length < 2) {
      return null;
    }
    const urlTileset = dataLines[0];
    // Il faut que ce soit exactement la même ligne entre celle qui fait la séparation entre
    // l'url et la conf json, et celle qui fait la séparation entre la conf json et le gamecode.
    // Aux espaces près ! (Donc le mieux est de pas mettre d'espace du tout).
    const separator = dataLines[1];
    const gameSpecElems = response.data.split(`\n${separator}\n`, 3);
    if (gameSpecElems.length !== 3) {
      return null;
    }
    const jsonConf = gameSpecElems[1];
    const gameCode = gameSpecElems[2];
    return {
      urlTileset,
      jsonConf,
      gameCode,
    };
  },

});
