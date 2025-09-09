const LIST = document.getElementById('list');
const Q = document.getElementById('q');
const selectedItems = new Set();
const EXPORT_BUTTON = document.getElementById('export');
const TAG_BUTTONS_CONTAINER = document.getElementById('tag-buttons');
const COMPARE_MODAL = document.getElementById('compare-modal');
const COMPARE_BTN = document.getElementById('compare-btn');
const CLOSE_BTN = document.querySelector('.close-btn');
const COMPARE_TABLE_CONTAINER = document.getElementById('compare-table-container');

let activeTag = null;
let maps = {}; // 地図インスタンスを格納するオブジェクト

function loadSaved(){
  try{ const raw = localStorage.getItem('wars_notes_v11'); if(!raw) return {}; return JSON.parse(raw); }catch(e){return {}} }
function saveAll(data){ localStorage.setItem('wars_notes_v11', JSON.stringify(data)); }
const saved = loadSaved();

function renderTags() {
  const allTags = WARS_DATA.reduce((acc, it) => {
    if (it.tags) {
      it.tags.forEach(tag => acc.add(tag));
    }
    return acc;
  }, new Set());

  TAG_BUTTONS_CONTAINER.innerHTML = '';
  allTags.forEach(tag => {
    const button = document.createElement('button');
    button.textContent = tag;
    if (tag === activeTag) {
      button.classList.add('active');
    }
    button.addEventListener('click', () => {
      if (activeTag === tag) {
        activeTag = null;
      } else {
        activeTag = tag;
      }
      renderTags();
      render();
    });
    TAG_BUTTONS_CONTAINER.appendChild(button);
  });
}

function render(filter=''){
  LIST.innerHTML='';
  const f = filter.trim().toLowerCase();

  const filteredItems = WARS_DATA.filter(it => {
    const hasTag = activeTag ? (it.tags && it.tags.includes(activeTag)) : true;

    const matchesSearch = f ? 
        it.title.toLowerCase().includes(f) || 
        (it.desc && it.desc.toLowerCase().includes(f)) ||
        (it.keywords && it.keywords.some(keyword => keyword.toLowerCase().includes(f)))
        : true;

    const isNumberFilter = !isNaN(f) && f.length > 0;
    const matchesYear = isNumberFilter ? (parseInt(f) >= it.startYear && parseInt(f) <= it.endYear) : false;

    return hasTag && (matchesSearch || matchesYear);
  });

  if(filteredItems.length===0){
    LIST.innerHTML = '<div class="card">該当する項目がありません。</div>';
    return;
  }

  filteredItems.forEach(it=>{
    const card = document.createElement('div');
    card.className='card';
    if(selectedItems.has(it.id)){
      card.classList.add('selected');
    }

    const h = document.createElement('h3');
    h.textContent = it.title;
    h.addEventListener('click', ()=>{
      const d = card.querySelector('.details');
      d.setAttribute('contenteditable','true');
      d.focus();
    });

    const yearElem = document.createElement('div');
    yearElem.className = 'year';
    yearElem.textContent = it.year;

    const meta = document.createElement('div');
    meta.className='meta';
    meta.textContent = '編集可能 — 保存は自動。';

    const det = document.createElement('div');
    det.className='details';
    det.dataset.id = it.id;
    det.innerHTML = (saved[it.id] && saved[it.id].desc) ? saved[it.id].desc : it.desc;

    det.addEventListener('focusout', ()=>{
      const id = det.dataset.id;
      const content = det.innerHTML;
      saved[id] = saved[id] || {};
      saved[id].desc = content;
      saved[id].title = it.title;
      saveAll(saved);
      det.removeAttribute('contenteditable');
    });

    det.addEventListener('keydown',(e)=>{
      if(e.key === 'Escape') {
        det.blur();
      }
      if(e.key === 'Enter' && (e.ctrlKey||e.metaKey)) {
        e.preventDefault();
        det.blur();
      }
    });

    const actions = document.createElement('div');
    actions.className='actions';

    // Wikipediaへのリンクボタン
    const wikiLink = document.createElement('a');
    wikiLink.href = `https://ja.wikipedia.org/wiki/${encodeURIComponent(it.wiki)}`;
    wikiLink.textContent = 'Wikipediaで詳細を見る';
    wikiLink.target = '_blank';
    wikiLink.className = 'wiki-link';

    // 地図表示ボタン
    if (it.lat && it.lng) {
      const mapBtn = document.createElement('button');
      mapBtn.textContent = '地図を見る';
      mapBtn.addEventListener('click', () => {
        const mapContainer = card.querySelector('.map-container');
        if (mapContainer.style.display === 'block') {
          mapContainer.style.display = 'none';
          mapBtn.textContent = '地図を見る';
        } else {
          mapContainer.style.display = 'block';
          mapBtn.textContent = '地図を閉じる';
          if (!maps[it.id]) {
            const map = new google.maps.Map(mapContainer, {
              center: {lat: it.lat, lng: it.lng},
              zoom: it.zoom || 8,
            });
            new google.maps.Marker({
              position: {lat: it.lat, lng: it.lng},
              map: map,
              title: it.title,
            });
            maps[it.id] = map;
          }
        }
      });
      actions.appendChild(mapBtn);
    }

    actions.appendChild(wikiLink);

    // 因果関係リンク
    if (it.relations && it.relations.length > 0) {
      it.relations.forEach(rel => {
        const relBtn = document.createElement('button');
        relBtn.textContent = rel.text;
        relBtn.className = 'relation-link';
        relBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetCard = document.querySelector(`.card:has([data-id='${rel.targetId}'])`);
          if (targetCard) {
            window.scrollTo({
              top: targetCard.offsetTop - 20,
              behavior: 'smooth'
            });
            targetCard.classList.add('highlight');
            setTimeout(() => targetCard.classList.remove('highlight'), 2000);
          }
        });
        actions.appendChild(relBtn);
      });
    }

    const mapContainer = document.createElement('div');
    mapContainer.className = 'map-container';
    mapContainer.id = `map-${it.id}`;
    mapContainer.style.display = 'none';

    card.appendChild(yearElem);
    card.appendChild(h);
    card.appendChild(meta);
    card.appendChild(det);
    card.appendChild(actions);
    card.appendChild(mapContainer);

    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.actions')) {
        return;
      }
      e.stopPropagation(); // 重複選択防止

      const isSelected = selectedItems.has(it.id);
      if (isSelected) {
        selectedItems.delete(it.id);
        card.classList.remove('selected');
      } else {
        selectedItems.add(it.id);
        card.classList.add('selected');
      }
    });

    LIST.appendChild(card);
  });
}

// 比較ボタンの処理
COMPARE_BTN.addEventListener('click', () => {
    if (selectedItems.size === 0) {
        alert('比較する項目を選択してください。');
        return;
    }
    renderCompareTable();
    COMPARE_MODAL.style.display = 'flex';
});

// モーダルを閉じる処理
CLOSE_BTN.addEventListener('click', () => {
    COMPARE_MODAL.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === COMPARE_MODAL) {
        COMPARE_MODAL.style.display = 'none';
    }
});

// 比較表のレンダリング
function renderCompareTable() {
    const selectedData = WARS_DATA.filter(it => selectedItems.has(it.id));
    if (selectedData.length === 0) {
        COMPARE_TABLE_CONTAINER.innerHTML = '<p>選択された項目がありません。</p>';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // ヘッダー行の作成
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>項目名</th>
        <th>期間</th>
        <th>相手国・勢力</th>
        <th>死傷者数 (日本側)</th>
    `;
    thead.appendChild(headerRow);

    // データ行の作成
    selectedData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.year}</td>
            <td>${item.vs || '不明'}</td>
            <td>${item.casualties || '不明'}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    COMPARE_TABLE_CONTAINER.innerHTML = '';
    COMPARE_TABLE_CONTAINER.appendChild(table);
}


Q.addEventListener('input', ()=> render(Q.value));

document.getElementById('print').addEventListener('click', ()=> window.print());

EXPORT_BUTTON.addEventListener('click', ()=>{
    if(selectedItems.size === 0) {
        alert("エクスポートする項目を選択してください。");
        return;
    }

    const selectedData = WARS_DATA.filter(it => selectedItems.has(it.id));
    const out = selectedData.map(it => {
        const savedContent = saved[it.id] ? saved[it.id].desc : it.desc;
        const plainText = savedContent.replace(/<[^>]+>/g, '').trim();
        return {
            id: it.id,
            title: it.title,
            year: it.year,
            desc: plainText
        };
    });

    const blob = new Blob([JSON.stringify(out, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_wars_export.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

// 初期レンダリング
renderTags();
render();
