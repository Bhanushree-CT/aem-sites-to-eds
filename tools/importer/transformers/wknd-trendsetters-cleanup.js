/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup.
 * Removes non-authorable site chrome and cleans up Astro framework artifacts.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove Astro data attributes that could interfere with block parsing
    // Found in captured HTML: <body data-astro-cid-37fxchfa="">
    element.querySelectorAll('[data-astro-cid-37fxchfa]').forEach((el) => {
      el.removeAttribute('data-astro-cid-37fxchfa');
    });
    // Remove any other data-astro-cid-* attributes (Astro framework artifacts)
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid-')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable navigation chrome
    // Found in captured HTML: <div class="navbar">
    WebImporter.DOMUtils.remove(element, ['.navbar']);

    // Remove skip link (site chrome, not authorable)
    // Found in captured HTML: <a href="#main-content" class="skip-link">
    WebImporter.DOMUtils.remove(element, ['.skip-link']);

    // Remove footer (non-authorable, managed separately in EDS)
    // Found in captured HTML: <footer class="footer inverse-footer">
    WebImporter.DOMUtils.remove(element, ['footer.footer']);

    // Remove any remaining noscript, link, or script elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link', 'script']);
  }
}
