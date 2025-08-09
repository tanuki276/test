// kuromoji.jsが読み込めたかテスト
const analyzeBtn = document.getElementById('analyzeBtn');

if (typeof kuromoji !== 'undefined') {
    // kuromoji.jsが読み込めた場合の処理
    analyzeBtn.textContent = 'kuromoji.js読み込み成功';
    analyzeBtn.disabled = true; // 判定ボタンは無効のままにしておく
    console.log('kuromoji.jsライブラリが正常に読み込まれました。');
} else {
    // kuromoji.jsが読み込めなかった場合の処理
    analyzeBtn.textContent = 'kuromoji.js読み込み失敗';
    analyzeBtn.disabled = true;
    console.error('kuromoji.jsライブラリの読み込みに失敗しました。');
}
