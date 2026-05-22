/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Selectors from captured DOM (migration-work/cleaned.html) and page-templates.json.
 *
 * Sections (from page-templates.json):
 *   1. Hero - selector: "header.section.secondary-section" - no style
 *   2. Featured Article - selector: "main > section.section:nth-of-type(1)" - no style
 *   3. Image Gallery - selector: "main > section.section.secondary-section:nth-of-type(1)" - style: grey
 *   4. Testimonials - selector: "main > section.section:nth-of-type(3)" - no style
 *   5. Latest Articles - selector: "main > section.section.secondary-section:nth-of-type(2)" - style: grey
 *   6. FAQ - selector: "main > section.section:nth-of-type(5)" - no style
 *   7. CTA Banner - selector: "section.inverse-section" - no style
 *
 * Note: nth-of-type counts ALL elements of a given tag type regardless of class.
 * The selectors with .secondary-section:nth-of-type(N) may not match as intended,
 * so we use a sequential matching strategy based on DOM order.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Finds section elements in DOM order using class-based matching.
 * Handles nth-of-type selector issues by tracking which elements
 * have already been matched to earlier sections.
 */
function findSectionElements(element, sections) {
  const results = [];
  const used = new Set();

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const selector = section.selector;
    let found = null;

    // Try direct querySelector approaches
    // 1. Try as-is
    found = element.querySelector(selector);

    // 2. If selector starts with "main > ", try :scope >
    if (!found && selector.startsWith('main > ')) {
      found = element.querySelector(selector.replace('main > ', ':scope > '));
    }

    // 3. If still not found and selector has nth-of-type with a class constraint,
    //    find by class and pick the Nth unused match
    if (!found) {
      // Extract base classes from selector (without nth-of-type)
      // e.g. "main > section.section.secondary-section:nth-of-type(1)" -> "section.section.secondary-section"
      let baseSelector = selector
        .replace(/^main\s*>\s*/, '')
        .replace(/:nth-of-type\(\d+\)/, '');

      const candidates = element.querySelectorAll(baseSelector);
      for (const candidate of candidates) {
        if (!used.has(candidate)) {
          found = candidate;
          break;
        }
      }
    }

    if (found) {
      used.add(found);
    }
    results.push({ section, el: found });
  }

  return results;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;

    if (!sections || sections.length < 2) return;

    // Find all section elements using robust matching
    const matched = findSectionElements(element, sections);

    // Process sections in reverse order to preserve DOM positions
    for (let i = matched.length - 1; i >= 0; i--) {
      const { section, el: sectionEl } = matched[i];

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetadata);
      }

      // Insert <hr> before section element (except the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
