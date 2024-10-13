var loadcss = function() {
  "use strict";
  const loadCss = (filePath) => {
    const url = chrome.runtime.getURL(filePath);
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    }).then((css) => css);
  };
  loadcss;
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      return await loadCss.main();
    } catch (err) {
      logger.error(
        `The unlisted script "${"loadcss"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
}();
loadcss;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGNzcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vZW50cnlwb2ludHMvbG9hZGNzcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsb2FkQ3NzLmpzXHJcbmV4cG9ydCBjb25zdCBsb2FkQ3NzID0gKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcclxuICAgIC8vIEdldCB0aGUgY29ycmVjdCBVUkwgZm9yIHRoZSBmaWxlIHBhdGggcmVsYXRpdmUgdG8gdGhlIGV4dGVuc2lvblxyXG4gICAgY29uc3QgdXJsID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKGZpbGVQYXRoKTtcclxuXHJcbiAgICByZXR1cm4gZmV0Y2godXJsKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXR3b3JrIHJlc3BvbnNlIHdhcyBub3Qgb2snKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oY3NzID0+IGNzcyk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBsb2FkQ3NzOyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNhLFFBQUEsVUFBVSxDQUFDLGFBQXFCO0FBRXpDLFVBQU0sTUFBTSxPQUFPLFFBQVEsT0FBTyxRQUFRO0FBRTFDLFdBQU8sTUFBTSxHQUFHLEVBQ1gsS0FBSyxDQUFZLGFBQUE7QUFDVixVQUFBLENBQUMsU0FBUyxJQUFJO0FBQ1IsY0FBQSxJQUFJLE1BQU0sNkJBQTZCO0FBQUEsTUFDakQ7QUFDQSxhQUFPLFNBQVM7SUFDbkIsQ0FBQSxFQUNBLEtBQUssQ0FBQSxRQUFPLEdBQUc7QUFBQSxFQUN4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
