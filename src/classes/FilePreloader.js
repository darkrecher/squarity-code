export default class FilePreloader {

    constructor(progressIndicator) {
      this.progressIndicator = progressIndicator;
    }

    async preloadFile(url, mimeType) {
      let result = await this.makeRequest("GET", url, mimeType);
      return result;
    }

    updateProgress(evt)
    {
      // https://stackoverflow.com/questions/76976/how-to-get-progress-from-xmlhttprequest
      if (evt.lengthComputable) {
        // evt.loaded the bytes the browser received
        // evt.total the total bytes set by the header
        var percentComplete = (evt.loaded / evt.total) * 100;
        console.log("progress wesh", evt.loaded, " / ", evt.total);
        console.log(this.progressIndicator);
      }
    }

    // https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
    makeRequest(method, url, mimeType) {
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        // C'est possiblement crade, mais je sais pas si y'a une pratique plus civilisée que ça.
        xhr.progressIndicator = this.progressIndicator;
        // https://www.developpez.net/forums/i2066999/javascript/ajax/erreur-d-analyse-xml-mal-forme/
        if (mimeType) {
          xhr.overrideMimeType(mimeType);
        }
        xhr.open(method, url);
        xhr.onprogress = this.updateProgress;
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
        xhr.send();
      });
    }


}
