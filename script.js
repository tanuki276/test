const LIST = document.getElementById('list');
const Q = document.getElementById('q');
const EXPORT_BUTTON = document.getElementById('export');
const TAG_BUTTONS_CONTAINER = document.getElementById('tag-buttons');
const COMPARE_MODAL = document.getElementById('compare-modal');
const COMPARE_BTN = document.getElementById('compare-btn');
const CLOSE_BTN = document.querySelector('.close-btn');
const COMPARE_TABLE_CONTAINER = document.getElementById('compare-table-container');
const RESULT_COUNT = document.getElementById('result-count');
const SELECTION_COUNT = document.getElementById('selection-count');
const CLEAR_SEARCH = document.getElementById('clear-search');
const FOOTER_YEAR = document.getElementById('footer-year');

const selectedItems = new Set();
const maps = new Map();
let activeTag = null;

function loadSaved() {
  try {
    const raw = localStorage.getItem('wars_notes_v11');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data) {
  try {
    localStorage.setItem('wars_notes_v11', JSON.stringify(data));
  } catch (error) {
    console.warn('編集内容を保存できませんでした。', error);
  }
}

const saved = loadSaved();

function updateSelectionStatus() {
  const count = selectedItems.size;
  SELECTION_COUNT.textContent = count > 0 ? `${count}件を選択中` : '項目を選択すると比較できます';
  COMPARE_BTN.textContent = count > 0 ? `選択した${count}件を比較` : '選択項目を比較';
}

function renderTags() {
  if (!Array.isArray(WARS_DATA)) return;

  const allTags = [...new Set(WARS_DATA.flatMap(item => item.tags || []))].sort((a, b) => a.localeCompare(b, 'ja'));
  TAG_BUTTONS_CONTAINER.replaceChildren();

  allTags.forEach(tag => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = tag;
    button.classList.toggle('active', tag === activeTag);
    button.setAttribute('aria-pressed', String(tag === activeTag));
    button.addEventListener('click', () => {
      activeTag = activeTag === tag ? null : tag;
      renderTags();
      render(Q.value);
    });
    TAG_BUTTONS_CONTAINER.appendChild(button);
  });
}

function matchesQuery(item, query) {
  if (!query) return true;

  const normalized = query.toLowerCase();
  const searchable = [
    item.title,
    item.desc?.replace(/<[^>]+>/g, ' '),
    item.year,
    item.vs,
    item.casualties,
    ...(item.tags || []),
    ...(item.keywords || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (searchable.includes(normalized)) return true;

  const year = Number.parseInt(normalized, 10);
  return Number.isFinite(year) && year >= item.startYear && year <= item.endYear;
}

function render(filter = '') {
  if (!Array.isArray(WARS_DATA)) {
    LIST.innerHTML = '<div class="empty-state">データを読み込めませんでした。</div>';
    return;
  }

  maps.forEach(map => map.remove());
  maps.clear();
  LIST.replaceChildren();

  const query = filter.trim();
  const filteredItems = WARS_DATA.filter(item => {
    const tagMatches = activeTag ? item.tags?.includes(activeTag) : true;
    return tagMatches && matchesQuery(item, query);
  });

  RESULT_COUNT.textContent = `${filteredItems.length}件 / 全${WARS_DATA.length}件を表示`;

  if (filteredItems.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = '条件に合う項目がありません。検索語やタグを変えてみてください。';
    LIST.appendChild(empty);
    return;
  }

  filteredItems.forEach(item => LIST.appendChild(createCard(item)));
}

function createCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.itemId = item.id;
  card.tabIndex = 0;
  card.setAttribute('aria-label', `${item.title}。クリックまたはEnterで選択`);
  card.classList.toggle('selected', selectedItems.has(item.id));

  const header = document.createElement('div');
  header.className = 'card-header';

  const titleGroup = document.createElement('div');
  const year = document.createElement('div');
  year.className = 'year';
  year.textContent = item.year;

  const title = document.createElement('h3');
  title.textContent = item.title;
  title.title = 'クリックすると説明を編集できます';

  titleGroup.append(year, title);
  header.appendChild(titleGroup);

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = '説明は編集可能・自動保存';

  const details = document.createElement('div');
  details.className = 'details';
  details.dataset.id = item.id;
  const rawContent = saved[item.id]?.desc ?? item.desc ?? '';
  details.innerHTML = DOMPurify.sanitize(rawContent);

  title.addEventListener('click', event => {
    event.stopPropagation();
    details.contentEditable = 'true';
    details.focus();
  });

  details.addEventListener('click', event => event.stopPropagation());
  details.addEventListener('focusout', () => {
    if (details.contentEditable !== 'true') return;
    const cleanContent = DOMPurify.sanitize(details.innerHTML);
    details.innerHTML = cleanContent;
    saved[item.id] = { ...(saved[item.id] || {}), desc: cleanContent, title: item.title };
    saveAll(saved);
    details.removeAttribute('contenteditable');
  });

  details.addEventListener('keydown', event => {
    if (event.key === 'Escape' || (event.key === 'Enter' && (event.ctrlKey || event.metaKey))) {
      event.preventDefault();
      details.blur();
    }
  });

  const actions = createActions(item, card);
  const mapContainer = document.createElement('div');
  mapContainer.className = 'map-container';
  mapContainer.id = `map-${item.id}`;
  mapContainer.hidden = true;

  card.append(header, meta, details, actions, mapContainer);

  const toggleSelection = () => {
    if (selectedItems.has(item.id)) {
      selectedItems.delete(item.id);
      card.classList.remove('selected');
    } else {
      selectedItems.add(item.id);
      card.classList.add('selected');
    }
    updateSelectionStatus();
  };

  card.addEventListener('click', event => {
    if (event.target.closest('a, button, [contenteditable="true"]')) return;
    toggleSelection();
  });

  card.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target === card) {
      event.preventDefault();
      toggleSelection();
    }
  });

  return card;
}

function createActions(item, card) {
  const actions = document.createElement('div');
  actions.className = 'actions';

  const dataBtn = document.createElement('button');
  dataBtn.type = 'button';
  dataBtn.textContent = 'データを見る';
  dataBtn.addEventListener('click', () => openCompare([item]));
  actions.appendChild(dataBtn);

  if (item.lat && item.lng) {
    const mapBtn = document.createElement('button');
    mapBtn.type = 'button';
    mapBtn.textContent = '地図を見る';
    mapBtn.setAttribute('aria-expanded', 'false');

    mapBtn.addEventListener('click', () => {
      const container = card.querySelector('.map-container');
      const opening = container.hidden;
      container.hidden = !opening;
      mapBtn.textContent = opening ? '地図を閉じる' : '地図を見る';
      mapBtn.setAttribute('aria-expanded', String(opening));

      if (!opening) {
        maps.get(item.id)?.remove();
        maps.delete(item.id);
        return;
      }

      if (!maps.has(item.id)) {
        const map = L.map(container).setView([item.lat, item.lng], item.zoom || 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
        L.marker([item.lat, item.lng]).addTo(map).bindPopup(item.title).openPopup();
        maps.set(item.id, map);
        requestAnimationFrame(() => map.invalidateSize());
      }
    });
    actions.appendChild(mapBtn);
  }

  const wikiLink = document.createElement('a');
  wikiLink.href = `https://ja.wikipedia.org/wiki/${encodeURIComponent(item.wiki)}`;
  wikiLink.textContent = 'Wikipediaで確認';
  wikiLink.target = '_blank';
  wikiLink.rel = 'noopener noreferrer';
  wikiLink.className = 'wiki-link';
  actions.appendChild(wikiLink);

  (item.relations || []).forEach(relation => {
    const relBtn = document.createElement('button');
    relBtn.type = 'button';
    relBtn.textContent = relation.text;
    relBtn.className = 'relation-link';
    relBtn.addEventListener('click', () => {
      const target = document.querySelector(`.card[data-item-id="${CSS.escape(String(relation.targetId))}"]`);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
    });
    actions.appendChild(relBtn);
  });

  return actions;
}

function openCompare(items) {
  renderCompareTable(items);
  if (typeof COMPARE_MODAL.showModal === 'function') {
    COMPARE_MODAL.showModal();
  } else {
    COMPARE_MODAL.setAttribute('open', '');
  }
}

function closeCompare() {
  if (COMPARE_MODAL.open && typeof COMPARE_MODAL.close === 'function') {
    COMPARE_MODAL.close();
  } else {
    COMPARE_MODAL.removeAttribute('open');
  }
}

function renderCompareTable(items) {
  COMPARE_TABLE_CONTAINER.replaceChildren();

  if (!items.length) {
    const message = document.createElement('p');
    message.textContent = '選択された項目がありません。';
    COMPARE_TABLE_CONTAINER.appendChild(message);
    return;
  }

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headerRow = document.createElement('tr');

  ['項目名', '期間', '相手国・勢力', '死傷者数（日本側）'].forEach(label => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  items.forEach(item => {
    const row = document.createElement('tr');
    [item.title, item.year, item.vs || '不明', item.casualties || '不明'].forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  table.append(thead, tbody);
  COMPARE_TABLE_CONTAINER.appendChild(table);
}

COMPARE_BTN.addEventListener('click', () => {
  if (!selectedItems.size) {
    alert('比較する項目を選択してください。');
    return;
  }
  openCompare(WARS_DATA.filter(item => selectedItems.has(item.id)));
});

CLOSE_BTN.addEventListener('click', closeCompare);
COMPARE_MODAL.addEventListener('click', event => {
  if (event.target === COMPARE_MODAL) closeCompare();
});

Q.addEventListener('input', () => render(Q.value));
CLEAR_SEARCH.addEventListener('click', () => {
  Q.value = '';
  activeTag = null;
  renderTags();
  render();
  Q.focus();
});

document.getElementById('print').addEventListener('click', () => window.print());

EXPORT_BUTTON.addEventListener('click', () => {
  if (!selectedItems.size) {
    alert('エクスポートする項目を選択してください。');
    return;
  }

  const selectedData = WARS_DATA.filter(item => selectedItems.has(item.id));
  const out = selectedData.map(item => ({
    id: item.id,
    title: item.title,
    year: item.year,
    desc: DOMPurify.sanitize(saved[item.id]?.desc ?? item.desc ?? '').replace(/<[^>]+>/g, '').trim(),
  }));

  const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'selected_wars_export.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

FOOTER_YEAR.textContent = new Date().getFullYear();
renderTags();
render();
updateSelectionStatus();
