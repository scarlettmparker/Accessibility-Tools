export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // GET WIKTIONARY DATA REQUEST
    if (request.type === "fetchWiktionaryData") {
      const { word } = request;

      WiktionaryScrape(word)
        .then((simulatedData) => {
          sendResponse(simulatedData);
        })
        .catch((error) => {
          sendResponse({ error: 'Failed to fetch data: ' + error });
        });

      return true;
    }

    // TRANSLATE TEXT REQUEST
    if (request.type === "translateText") {
      const { data, language } = request;

      TranslateText(data, language)
        .then((translatedText) => {
          sendResponse(translatedText);
        })
        .catch((error) => {
          sendResponse({ error: 'Failed to fetch data: ' + error });
        });

      return true;
    }
  });
});

async function WiktionaryScrape(word: string) {
  const WIKTIONARY_URL = "https://en.wiktionary.org/wiki/" + encodeURIComponent(word);

  // fetch the html from the wiktionary page
  const html = await fetch(WIKTIONARY_URL);
  if (!html.ok) {
    throw new Error('Network response was not ok');
  }

  const text = await html.text();
  return text;
}

async function TranslateText(data: { label: string, text: string }[], language: string) {
  // send to python backend for translation
  const response = await fetch('http://localhost:8080/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data, language })
  });

  // check if the response is ok
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}