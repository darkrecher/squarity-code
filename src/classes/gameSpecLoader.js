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
    const dataLines = response.data.split('\n');
    if (dataLines.length < 2) {
      return null;
    }
    const urlTileset = dataLines[0];
    const separator = dataLines[1].trimEnd();
    let indexSeparator = 2;
    while (
      (indexSeparator < dataLines.length)
      && (dataLines[indexSeparator].trimEnd() !== separator)
    ) {
      indexSeparator += 1;
    }
    if (indexSeparator === dataLines.length) {
      return null;
    }
    const jsonConf = dataLines.slice(2, indexSeparator).join('\n');
    const gameCode = dataLines.slice(indexSeparator + 1).join('\n');
    return {
      urlTileset,
      jsonConf,
      gameCode,
    };
  },

});
