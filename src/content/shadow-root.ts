let shadowRoot: ShadowRoot | null = null;

/**
 * Records the content-script shadow root after it is attached.
 */
export function setShadowRoot(root: ShadowRoot | null): void {
  shadowRoot = root;
}

/**
 * Returns the content-script shadow root for portal targets.
 */
export function getShadowRoot(): ShadowRoot | null {
  return shadowRoot;
}
