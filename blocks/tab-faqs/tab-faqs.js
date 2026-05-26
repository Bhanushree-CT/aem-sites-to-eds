import { toClassName } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  const tabs = new Map();
  let currentTab = '';

  rows.forEach((row) => {
    const cols = [...row.children];
    const tabName = cols[0]?.textContent.trim();
    const question = cols.length > 1 ? cols[1]?.innerHTML.trim() : '';
    const answer = cols.length > 2 ? cols[2]?.innerHTML.trim() : '';

    if (tabName && cols.length > 1) {
      currentTab = tabName;
    } else if (tabName && cols.length === 1) {
      if (!currentTab) currentTab = 'General';
    }

    if (!currentTab) currentTab = 'General';
    if (!tabs.has(currentTab)) tabs.set(currentTab, []);

    const q = question || (cols.length === 1 ? cols[0]?.innerHTML.trim() : '');
    if (q) {
      tabs.get(currentTab).push({ question: q, answer });
    }
  });

  block.textContent = '';

  const tablist = document.createElement('div');
  tablist.className = 'tab-faqs-list';
  tablist.setAttribute('role', 'tablist');

  let isFirst = true;
  tabs.forEach((items, tabName) => {
    const id = toClassName(tabName);

    const button = document.createElement('button');
    button.className = 'tab-faqs-tab';
    button.id = `tab-${id}`;
    button.textContent = tabName;
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', isFirst);
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      block.querySelector(`#tabpanel-${id}`).setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);

    const panel = document.createElement('div');
    panel.className = 'tab-faqs-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', !isFirst);

    items.forEach(({ question: q, answer: a }) => {
      const details = document.createElement('details');
      details.className = 'tab-faqs-item';
      const summary = document.createElement('summary');
      summary.className = 'tab-faqs-question';
      summary.innerHTML = q;
      details.append(summary);
      if (a) {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'tab-faqs-answer';
        answerDiv.innerHTML = a;
        details.append(answerDiv);
      }
      panel.append(details);
    });

    block.append(panel);
    isFirst = false;
  });

  block.prepend(tablist);
}
