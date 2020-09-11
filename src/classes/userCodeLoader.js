const axios = require('axios');

export default Object.freeze({

  // TODO : on est bien d'accord que c'est dégueux de dépendre de deux ressources externes :
  // pastebin et cors-anywhere qui permet de passer la sécurité CORS.
  URL_PATTERN_PASTEBIN: 'https://cors-anywhere.herokuapp.com/http://pastebin.com/raw/{gameExternalId}',

  url_user_code_from_loc_hash() {
    const locHashSplitted = window.location.hash.split('_');
    if (locHashSplitted.length !== 3) {
      return null;
    }
    if (locHashSplitted[0] !== '#fetchez') {
      return null;
    }
    const gameExternalId = locHashSplitted[2];
    if (!gameExternalId.match(/^[0-9a-zA-Z]+$/)) {
      return null;
    }
    let urlPattern = '';
    // TODO : Pour l'instant, on n'a que pastebin, mais faudra ajouter github.
    if (locHashSplitted[1] === 'pastebin') {
      urlPattern = this.URL_PATTERN_PASTEBIN;
    }
    if (!urlPattern) {
      return null;
    }
    return urlPattern.replace('{gameExternalId}', gameExternalId);
  },

  async fetch_game_user_code(url) {
    let response = '';
    try {
      response = await axios.get(url);
      // TODO : moche et provisoire. Ce sera mieux
      // quand on aura fusionné les img coords et le code dans un même champ.
    } catch (error) {
      return null;
    }
    const dataSplitted = response.data.split('--------');
    if (dataSplitted.length !== 3) {
      return null;
    }
    return {
      urltileset: dataSplitted[0],
      coordstileset: dataSplitted[1],
      usercode: dataSplitted[2],
    };
  },

});
