// --- 鍵定義 ---
const KEY = [12, 85, 230, 47, 99, 150, 203, 77];

// --- ひらがなコード候補（重複含む） ---
const kanaCodeCandidatesRaw = {
  'あ': ['064', '460', '604'],
  'い': ['3728', '8372', '2837'],
  'う': ['03412', '12340', '43021'],
  'え': ['769', '976', '697'],
  'お': ['4257', '7542', '5742'],
  'か': ['k561', 'k615', 'k156'],
  'き': ['k562', 'k652', 'k256'],
  'く': ['k763', 'k637', 'k376'],
  'け': ['k874', 'k748', 'k487'],
  'こ': ['k985', 'k859', 'k598'],
  'さ': ['s777', 's7784', 's7770'],
  'し': ['s778', 's7788', 's77888'],
  'す': ['s779', 's797', 's977'],
  'せ': ['s880', 's808', 's088'],
  'そ': ['s991', 's919', 's199'],
  'た': ['t12', 't21', 't843'],
  'ち': ['t13', 't31', 't14'],
  'つ': ['t24', 't42', 't25'],
  'て': ['t35', 't53', 't36'],
  'と': ['t46', 't64', 't47'],
  'な': ['n803', 'n830', 'n038'],
  'に': ['n814', 'n841', 'n148'],
  'ぬ': ['n925', 'n952', 'n259'],
  'ね': ['n036', 'n063', 'n360'],
  'の': ['n147', 'n174', 'n471'],
  'は': ['h258', 'h285', 'h528'],
  'ひ': ['h369', 'h396', 'h639'],
  'ふ': ['h470', 'h407', 'h074'],
  'へ': ['h581', 'h518', 'h815'],
  'ほ': ['h692', 'h629', 'h296'],
  'ま': ['m703', 'm730', 'm037'],
  'み': ['m814', 'm841', 'm148'],
  'む': ['m925', 'm952', 'm259'],
  'め': ['m036', 'm063', 'm360'],
  'も': ['m147', 'm174', 'm471'],
  'や': ['y258', 'y285', 'y528'],
  'ゆ': ['y369', 'y396', 'y639'],
  'よ': ['y470', 'y407', 'y074'],
  'ら': ['r581', 'r518', 'r815'],
  'り': ['r692', 'r629', 'r296'],
  'る': ['r703', 'r730', 'r037'],
  'れ': ['r814', 'r841', 'r148'],
  'ろ': ['r925', 'r952', 'r259'],
  'わ': ['w036', 'w063', 'w360'],
  'を': ['w147', 'w174', 'w471'],
  'ん': ['x69', 'x73', 'x84'],
  'が': ['g561', 'g615', 'g156'],
  'ぎ': ['g562', 'g652', 'g256'],
  'ぐ': ['g763', 'g637', 'g376'],
  'げ': ['g874', 'g748', 'g487'],
  'ご': ['g985', 'g859', 'g598'],
  'ざ': ['z777', 'z777', 'z777'],  // 重複だらけなので除去される
  'じ': ['z778', 'z778', 'z778'],  // 同上
  'ず': ['z779', 'z797', 'z977'],
  'ぜ': ['z880', 'z808', 'z088'],
  'ぞ': ['z991', 'z919', 'z199'],
  'だ': ['d12', 'd21', 'd13'],
  'ぢ': ['d13', 'd31', 'd14'],
  'づ': ['d24', 'd42', 'd25'],
  'で': ['d35', 'd53', 'd36'],
  'ど': ['d46', 'd64', 'd47'],
  'ば': ['b258', 'b285', 'b528'],
  'び': ['b369', 'b396', 'b639'],
  'ぶ': ['b470', 'b407', 'b074'],
  'べ': ['b581', 'b518', 'b815'],
  'ぼ': ['b692', 'b629', 'b296'],
  'ぱ': ['p258', 'p285', 'p528'],
  'ぴ': ['p369', 'p396', 'p639'],
  'ぷ': ['p470', 'p407', 'p074'],
  'ぺ': ['p581', 'p518', 'p815'],
  'ぽ': ['p692', 'p629', 'p296'],
  'ぁ': ['a01', 'a10', 'a11'],
  'ぃ': ['i02', 'i20', 'i22'],
  'ぅ': ['u03', 'u30', 'u33'],
  'ぇ': ['e04', 'e40', 'e44'],
  'ぉ': ['o05', 'o50', 'o55'],
  'ゃ': ['y01', 'y10', 'y11'],
  'ゅ': ['y02', 'y20', 'y22'],
  'ょ': ['y03', 'y30', 'y33'],
  'っ': ['t00', 't99', 't88'],
  'ー': ['00', '000', '0000'],
};

// 重複コードを排除しつつ候補を生成
function removeDuplicateCodes(candidates) {
  const usedCodes = new Set();
  const cleaned = {};
  for (const [kana, codes] of Object.entries(candidates)) {
    cleaned[kana] = [];
    for (const code of codes) {
      if (!usedCodes.has(code)) {
        cleaned[kana].push(code);
        usedCodes.add(code);
      }
    }
    // 候補が空なら仮コードを入れる
    if (cleaned[kana].length === 0) {
      cleaned[kana].push(`x${kana.charCodeAt(0)}`);
      usedCodes.add(`x${kana.charCodeAt(0)}`);
    }
  }
  return cleaned;
}

const kanaCodeCandidates = removeDuplicateCodes(kanaCodeCandidatesRaw);

// 逆マップ（コード→ひらがな）
const codeToKanaMap = {};
for (const [kana, codes] of Object.entries(kanaCodeCandidates)) {
  for (const code of codes) {
    codeToKanaMap[code] = kana;
  }
}

// 入力の正規化
function normalizeInput(str) {
  return str.normalize('NFC').trim();
}

// ひらがな→コード（ランダム選択）
function encodeKanaRandom(input) {
  const codes = [];
  for (const ch of input) {
    if (kanaCodeCandidates[ch]) {
      const arr = kanaCodeCandidates[ch];
      const choice = arr[Math.floor(Math.random() * arr.length)];
      codes.push(choice);
    } else {
      codes.push(`[${ch}]`);
    }
  }
  return codes.join('');
}

// XOR暗号化
function xorEncrypt(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  const encrypted = bytes.map((b, i) => b ^ KEY[i % KEY.length]);
  return encrypted.map(b => ('0' + b.toString(16)).slice(-2)).join('');
}

// XOR復号
function xorDecrypt(hexStr) {
  const bytes = [];
  for (let i = 0; i < hexStr.length; i += 2) {
    bytes.push(parseInt(hexStr.substr(i, 2), 16));
  }
  const decrypted = bytes.map((b, i) => b ^ KEY[i % KEY.length]);
  return String.fromCharCode(...decrypted);
}

// コード分割（長いコードから優先してマッチング）
function splitCodes(codeStr) {
  const codes = [];
  let i = 0;
  // 5→4→3→2文字長のコード長優先順
  const codeLengths = [5, 4, 3, 2];
  while (i < codeStr.length) {
    let matched = false;
    for (const len of codeLengths) {
      if (i + len <= codeStr.length) {
        const sub = codeStr.substring(i, i + len);
        if (codeToKanaMap[sub]) {
          codes.push(sub);
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      // マッチしない場合は1文字ずつ進む（エラー回避）
      codes.push(codeStr[i]);
      i++;
    }
  }
  return codes;
}

// エンコード全体処理
function fullEncode(input) {
  const normalized = normalizeInput(input);
  const rawCode = encodeKanaRandom(normalized);
  const encrypted = xorEncrypt(rawCode);
  return encrypted;
}

// 復号全体処理
function fullDecode(input) {
  let decrypted;
  try {
    decrypted = xorDecrypt(input);
  } catch {
    return '⚠️ 復号エラー: 入力が不正な16進文字列です';
  }

  const codes = splitCodes(decrypted);
  let result = '';
  for (const c of codes) {
    if (codeToKanaMap[c]) {
      result += codeToKanaMap[c];
    } else {
      result += '[?]';
    }
  }
  return result;
}

// UI操作のイベントハンドラ
window.addEventListener('DOMContentLoaded', () => {
  const encodeBtn = document.getElementById('encodeBtn');
  const decodeBtn = document.getElementById('decodeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const input = document.getElementById('input');
  const output = document.getElementById('output');

  // コピー用ボタンを作成
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '結果をコピー';
  copyBtn.style.marginTop = '10px';
  copyBtn.style.padding = '6px 12px';
  copyBtn.style.fontSize = '1em';
  copyBtn.style.cursor = 'pointer';
  copyBtn.style.display = 'none'; // 初期は非表示
  output.parentNode.insertBefore(copyBtn, output.nextSibling);

  copyBtn.addEventListener('click', () => {
    const text = output.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => alert('コピーしました！'))
      .catch(() => alert('コピーに失敗しました'));
  });

  encodeBtn.addEventListener('click', () => {
    const res = fullEncode(input.value);
    output.textContent = res;
    copyBtn.style.display = 'inline-block'; // ボタン表示
  });

  decodeBtn.addEventListener('click', () => {
    const res = fullDecode(input.value);
    output.textContent = res;
    copyBtn.style.display = 'inline-block'; // ボタン表示
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    output.textContent = '';
    copyBtn.style.display = 'none'; // ボタン非表示
  });
});