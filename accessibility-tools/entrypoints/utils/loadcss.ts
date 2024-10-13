// load the css file for each shadow root
export const useLoadCss = (shadowRoot: ShadowRoot, cssFile: string) => {
    useEffect(() => {
        const styleElement = document.createElement('style');

        // load the css file using the given file path
        loadCss(`/assets/styles/${cssFile}`)
            .then(css => {
                styleElement.textContent = css;

                // check if shadow root exists before appending
                if (shadowRoot) {
                    shadowRoot.appendChild(styleElement);
                } else {
                    console.error('shadowRoot is undefined');
                }
            })
            .catch(error => {
                // log the error if the css file fails to load
                console.error('Error loading CSS:', error);
            });
    }, [shadowRoot]);
};

const loadCss = (filePath: string) => {
    // get the url of the css file using the file path
    const url = chrome.runtime.getURL(filePath);

    return fetch(url)
        .then(response => {
            // check if the response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(css => css);
};

export default loadCss;