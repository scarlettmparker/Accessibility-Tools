import { createRoot } from 'react-dom/client';
import { ToolbarModal } from './toolbar';

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    console.log('Content script loaded');

    // create a container element
    const container = document.createElement('div');
    document.body.appendChild(container);

    // create a shadow root
    const shadowRoot = container.attachShadow({ mode: 'open' });
    const appContainer = document.createElement('div');
    shadowRoot.appendChild(appContainer);
    
    // render the component inside shadow dom
    const root = createRoot(appContainer);
    root.render(<ToolbarModal shadowRoot={shadowRoot} />);
  },
});