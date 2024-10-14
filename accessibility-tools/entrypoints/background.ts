import { parse } from 'node-html-parser';

export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
