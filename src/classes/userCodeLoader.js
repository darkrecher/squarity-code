// const axios = require('axios');

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

  // TODO : crap
  // axios.get('https://cors-anywhere.herokuapp.com/http://pastebin.com/raw/4Mqg1FjN')
  // .then((response) => {
  //   // handle success
  //   console.log(response);
  // });
});
