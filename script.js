function analyzeAIStyle(text) {
  const length = text.length || 1;
  const punctuationCount = (text.match(/、/g) || []).length;
  const spaceCount = (text.match(/ /g) || []).length;
  const newlineCount = (text.match(/\n/g) || []).length;

  const punctuationRate = punctuationCount / length;
  const spaceRate = spaceCount / length;
  const newlineRate = newlineCount / length;

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

  const hasKanjiNum = /[一二三四五六七八九十]/.test(text) ? 1 : 0;
  const hasArabicNum = /[0-9]/.test(text) ? 1 : 0;
  const mixedNumber = hasKanjiNum && hasArabicNum ? 1 : 0;

  // マークダウン記号
  const markdownSymbols = /[#*_`>-]/g;
  const markdownCount = (text.match(markdownSymbols) || []).length;
  const markdownRate = markdownCount / length;

  let aiScore = 50;

  aiScore += punctuationRate * 30;
  aiScore += spaceRate * 30;
  aiScore += newlineRate * 30;
  aiScore += connectorCount * 4;
  aiScore += sentenceEndSet.size * 3;
  aiScore += bracketsCount * 2;
  aiScore += mixedNumber * 5;
  aiScore += markdownRate * 40;

  if (aiScore > 100) aiScore = 100;
  if (aiScore < 0) aiScore = 0;

  const humanScore = 100 - aiScore;

  return {
    aiPercent: aiScore.toFixed(1),
    humanPercent: humanScore.toFixed(1),
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