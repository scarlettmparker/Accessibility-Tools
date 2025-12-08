export let currentMultiplier = 1;
export const baseFontSizes = new Map<Element, number>();

/**
 * Finds the closest HTMLElement that has an inline font-size style, or the parent element if none found.
 *
 * @param textNode - Text node to find the font size element for.
 * @returns HTMLElement with font size or the parent element.
 */
function getFontSizeElement(textNode: Text): HTMLElement {
  let element: HTMLElement | null = textNode.parentElement;
  while (element && element !== document.body.parentElement) {
    if (element.style.fontSize) {
      return element; // closest with inline
    }
    element = element.parentElement;
  }
  return textNode.parentElement as HTMLElement;
}

/**
 * Adjusts the font size of the given element based on the current multiplier.
 *
 * @param element - HTMLElement to adjust.
 */
function adjustElement(element: HTMLElement): void {
  let base = baseFontSizes.get(element);
  if (base === undefined) {
    const computed = getComputedStyle(element).fontSize;
    base = parseFloat(computed) || 16;
    baseFontSizes.set(element, base);
  }
  const newSize = base * currentMultiplier;
  element.style.setProperty("font-size", `${newSize}px`, "important");
}

/**
 * Adjusts the font size of the element containing the given text node.
 *
 * @param textNode - Text node to adjust.
 */
function adjustTextNode(textNode: Text): void {
  const element = getFontSizeElement(textNode);
  adjustElement(element);
}

/**
 * Adjusts the font sizes of all text nodes and input/textarea elements within the given root element.
 *
 * @param root - Root Element to traverse.
 */
function adjustAllTextNodes(root: Element): void {
  // Adjust text nodes
  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = node.parentElement;
      if (
        parent &&
        (parent.tagName === "SCRIPT" || parent.tagName === "STYLE")
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.textContent?.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  let node;
  while ((node = textWalker.nextNode())) {
    adjustTextNode(node as Text);
  }

  // Adjust input and textarea elements
  const elementWalker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node) => {
        if (
          (node as Element).tagName === "INPUT" ||
          (node as Element).tagName === "TEXTAREA"
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    }
  );
  let elem;
  while ((elem = elementWalker.nextNode())) {
    adjustElement(elem as HTMLElement);
  }
}

/**
 * Adjusts the global font size multiplier and applies it to all text in the document.
 * Also sets up a mutation observer if not already done.
 *
 * @param action - Whether to increase or decrease the font size.
 */
export function resetForTests(): void {
  currentMultiplier = 1;
  baseFontSizes.clear();
  observer = null;
}

export function adjustFontSize(action: "increase" | "decrease"): void {
  if (action === "increase") {
    currentMultiplier *= 1.1;
  } else {
    currentMultiplier *= 0.9;
  }
  adjustAllTextNodes(document.body);

  // Setup observer if not already
  if (!observer) {
    setupObserver();
  }
}

export let observer: MutationObserver | null = null;

/**
 * Sets up a MutationObserver to adjust font sizes for newly added elements.
 */
function setupObserver(): void {
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          adjustAllTextNodes(node as Element);
        }
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
