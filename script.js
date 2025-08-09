const MAX_SCORE = 18;

function analyzeAIStyle(text) {
  const punctuationCount = (text.match(/、/g) || []).length;
  const spaceCount = (text.match(/ /g) || []).length;
  const length = text.length || 1;
  const punctuationRate = punctuationCount / length;
  const spaceRate = spaceCount / length;

  const connectors = ["しかし", "だから", "つまり", "そして", "ところで"];
  let connectorCount = 0;
  connectors.forEach(word => {
    const regex = new RegExp(word, "g");
    connectorCount += (text.match(regex) || []).length;
  });

  const sentenceEnds = ["です", "ます", "だ", "である", "か？"];
  let sentenceEndSet = new Set();
  sentenceEnds.forEach(end => {
    if (text.includes(end)) sentenceEndSet.add(end);
  });

  const bracketsCount = (text.match(/[（）]/g) || []).length;

  const hasKanjiNum = /[一二三四五六七八九十]/.test(text);
  const hasArabicNum = /[0-9]/.test(text);
  const mixedNumber = hasKanjiNum && hasArabicNum ? 1 : 0;

  const rawScore =
    punctuationRate * 3 +
    spaceRate * 3 +   // ここで空白の割合も加算
    connectorCount * 2 +
    sentenceEndSet.size * 1.5 +
    bracketsCount * 1 +
    mixedNumber * 2;

  const aiPercent = Math.min(100, (rawScore / MAX_SCORE) * 100);
  const humanPercent = 100 - aiPercent;

  return {
    aiPercent: aiPercent.toFixed(1),
    humanPercent: humanPercent.toFixed(1),
  };
}

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const text = document.getElementById("inputText").value.trim();
  if (!text) {
    alert("文章を入力してください");
    return;
  }
  const result = analyzeAIStyle(text);

  document.getElementById("aiScore").textContent = result.aiPercent;
  document.getElementById("humanScore").textContent = result.humanPercent;

  document.getElementById("result").style.display = "block";
});