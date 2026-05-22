/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-landing.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1.h1-heading, h1, h2");
    const subheading = element.querySelector("p.subheading, p");
    const buttonGroup = element.querySelector(".button-group");
    const ctaLinks = buttonGroup ? Array.from(buttonGroup.querySelectorAll("a.button, a")) : Array.from(element.querySelectorAll("a.button, a"));
    const imageGridContainer = element.querySelectorAll(".grid-layout .grid-layout");
    let images = [];
    if (imageGridContainer.length > 0) {
      images = Array.from(imageGridContainer[0].querySelectorAll("img.cover-image, img"));
    } else {
      images = Array.from(element.querySelectorAll("img.cover-image, img"));
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    const imageCell = [];
    if (images.length > 0) imageCell.push(...images);
    const cells = [];
    if (imageCell.length > 0) {
      cells.push([contentCell, imageCell]);
    } else {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-landing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document }) {
    var _a;
    const gridLayout = element.querySelector(".grid-layout");
    const columns = gridLayout ? gridLayout.querySelectorAll(":scope > div") : element.querySelectorAll(".container > div > div");
    const leftCol = columns[0];
    const image = leftCol ? leftCol.querySelector('img.cover-image, img[class*="cover"], img') : null;
    const rightCol = columns[1];
    const rightContent = [];
    if (rightCol) {
      const breadcrumbs = rightCol.querySelector(".breadcrumbs");
      if (breadcrumbs) {
        const breadcrumbLinks = breadcrumbs.querySelectorAll("a.text-link, a");
        const breadcrumbP = document.createElement("p");
        breadcrumbLinks.forEach((link, index) => {
          if (index > 0) {
            breadcrumbP.append(document.createTextNode(" > "));
          }
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.textContent.trim();
          breadcrumbP.appendChild(a);
        });
        rightContent.push(breadcrumbP);
      }
      const heading = rightCol.querySelector('h2, h1, h3, [class*="heading"]');
      if (heading) {
        rightContent.push(heading);
      }
      const metaContainer = rightCol.querySelector('div[style*="margin-top"]');
      const metaDiv = metaContainer || ((_a = rightCol.querySelector(".flex-horizontal")) == null ? void 0 : _a.parentElement);
      if (metaDiv) {
        const authorRow = metaDiv.querySelector(".flex-horizontal");
        if (authorRow) {
          const authorSpans = authorRow.querySelectorAll("span");
          if (authorSpans.length >= 2) {
            const authorP = document.createElement("p");
            authorP.textContent = `${authorSpans[0].textContent.trim()} ${authorSpans[1].textContent.trim()}`;
            rightContent.push(authorP);
          }
        }
        const dateRow = metaDiv.querySelector(".flex-horizontal.flex-gap-xxs.utility-margin-top-0-5rem, .flex-horizontal:nth-child(2)");
        if (dateRow) {
          const dateSpans = dateRow.querySelectorAll("span");
          if (dateSpans.length > 0) {
            const dateP = document.createElement("p");
            const dateParts = [];
            dateSpans.forEach((span) => {
              dateParts.push(span.textContent.trim());
            });
            dateP.textContent = dateParts.join(" ");
            rightContent.push(dateP);
          }
        }
      }
    }
    const cells = [];
    const leftCell = [];
    if (image) {
      leftCell.push(image);
    }
    cells.push([leftCell, rightContent]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const imageContainers = element.querySelectorAll('.utility-aspect-1x1, [class*="aspect-"]');
    const images = [];
    imageContainers.forEach((container) => {
      const img = container.querySelector("img");
      if (img) {
        images.push(img);
      }
    });
    if (images.length === 0) {
      const directImages = element.querySelectorAll("img");
      directImages.forEach((img) => {
        images.push(img);
      });
    }
    const cells = [];
    images.forEach((img) => {
      const imgClone = img.cloneNode(true);
      cells.push([imgClone, ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const tabPanes = element.querySelectorAll(".tabs-content .tab-pane");
    const tabButtons = element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button");
    const cells = [];
    tabPanes.forEach((pane, index) => {
      let tabLabel = "";
      const button = tabButtons[index];
      if (button) {
        const nameEl = button.querySelector(".paragraph-sm strong, strong");
        tabLabel = nameEl ? nameEl.textContent.trim() : `Tab ${index + 1}`;
      } else {
        const paneName = pane.querySelector(".paragraph-xl strong, strong");
        tabLabel = paneName ? paneName.textContent.trim() : `Tab ${index + 1}`;
      }
      const contentElements = [];
      const image = pane.querySelector("img.cover-image, img");
      if (image) {
        const img = document.createElement("img");
        img.src = image.src || image.getAttribute("src");
        img.alt = image.alt || image.getAttribute("alt") || "";
        contentElements.push(img);
      }
      const nameDiv = pane.querySelector(".paragraph-xl strong, strong");
      if (nameDiv) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = nameDiv.textContent.trim();
        p.appendChild(strong);
        contentElements.push(p);
      }
      const gridContent = pane.querySelector(".grid-layout > div:nth-child(2)");
      if (gridContent) {
        const nameContainer = gridContent.querySelector(":scope > div:first-child");
        if (nameContainer) {
          const roleDiv = nameContainer.querySelector(":scope > div:nth-child(2)");
          if (roleDiv && !roleDiv.querySelector("strong")) {
            const p = document.createElement("p");
            p.textContent = roleDiv.textContent.trim();
            contentElements.push(p);
          }
        }
      }
      const quote = pane.querySelector("p.paragraph-xl, p");
      if (quote) {
        const p = document.createElement("p");
        p.textContent = quote.textContent.trim();
        contentElements.push(p);
      }
      cells.push([tabLabel, contentElements]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const cards = element.querySelectorAll("a.article-card, a.card-link");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img.cover-image, img");
      const bodyContent = [];
      const tag = card.querySelector(".article-card-meta .tag, .tag");
      if (tag) {
        const tagEl = document.createElement("p");
        tagEl.textContent = tag.textContent.trim();
        bodyContent.push(tagEl);
      }
      const date = card.querySelector(".article-card-meta .paragraph-sm, .utility-text-secondary");
      if (date) {
        const dateEl = document.createElement("p");
        dateEl.textContent = date.textContent.trim();
        bodyContent.push(dateEl);
      }
      const heading = card.querySelector('h3, .h4-heading, [class*="heading"]');
      if (heading) {
        bodyContent.push(heading);
      }
      const href = card.getAttribute("href");
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = heading ? heading.textContent.trim() : "";
        bodyContent.push(link);
      }
      const imageCell = img ? [img] : [];
      cells.push([imageCell, bodyContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const faqItems = element.querySelectorAll("details.faq-item, details");
    const cells = [];
    faqItems.forEach((item) => {
      const questionSpan = item.querySelector("summary .faq-question span, summary span, summary");
      const answerDiv = item.querySelector(".faq-answer, div:not(.faq-question)");
      const titleCell = [];
      if (questionSpan) {
        const titleEl = document.createElement("p");
        titleEl.textContent = questionSpan.textContent.trim();
        titleCell.push(titleEl);
      }
      const contentCell = [];
      if (answerDiv) {
        const paragraphs = answerDiv.querySelectorAll("p");
        if (paragraphs.length > 0) {
          paragraphs.forEach((p) => {
            contentCell.push(p);
          });
        } else {
          const contentEl = document.createElement("p");
          contentEl.textContent = answerDiv.textContent.trim();
          contentCell.push(contentEl);
        }
      }
      if (titleCell.length > 0) {
        cells.push([titleCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="background"], img');
    const heading = element.querySelector("h2.h1-heading, h1.h1-heading, h1, h2, h3");
    const description = element.querySelector("p.subheading, .card-body p, .utility-text-on-overlay p, p");
    const buttonGroup = element.querySelector(".button-group");
    const ctaLinks = buttonGroup ? Array.from(buttonGroup.querySelectorAll("a.button, a")) : Array.from(element.querySelectorAll("a.button, a.inverse-button, a"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      element.querySelectorAll("[data-astro-cid-37fxchfa]").forEach((el) => {
        el.removeAttribute("data-astro-cid-37fxchfa");
      });
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid-")) {
            el.removeAttribute(attr.name);
          }
        });
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".navbar"]);
      WebImporter.DOMUtils.remove(element, [".skip-link"]);
      WebImporter.DOMUtils.remove(element, ["footer.footer"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link", "script"]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElements(element, sections) {
    const results = [];
    const used = /* @__PURE__ */ new Set();
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const selector = section.selector;
      let found = null;
      found = element.querySelector(selector);
      if (!found && selector.startsWith("main > ")) {
        found = element.querySelector(selector.replace("main > ", ":scope > "));
      }
      if (!found) {
        let baseSelector = selector.replace(/^main\s*>\s*/, "").replace(/:nth-of-type\(\d+\)/, "");
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
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const matched = findSectionElements(element, sections);
      for (let i = matched.length - 1; i >= 0; i--) {
        const { section, el: sectionEl } = matched[i];
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-landing": parse,
    "columns-featured": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters homepage with hero, featured content sections, and newsletter signup",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero-landing",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "columns-featured",
        instances: ["main > section.section:nth-of-type(1)"]
      },
      {
        name: "cards-gallery",
        instances: [".secondary-section .desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: [".secondary-section .desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "header.section.secondary-section",
        style: null,
        blocks: ["hero-landing"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "main > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-featured"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Image Gallery",
        selector: "main > section.section.secondary-section:nth-of-type(1)",
        style: "grey",
        blocks: ["cards-gallery"],
        defaultContent: [".utility-text-align-center"]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: "main > section.section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest Articles",
        selector: "main > section.section.secondary-section:nth-of-type(2)",
        style: "grey",
        blocks: ["cards-article"],
        defaultContent: [".utility-text-align-center"]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "main > section.section:nth-of-type(5)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "CTA Banner",
        selector: "section.inverse-section",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
