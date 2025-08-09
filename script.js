function analyzeAIStyle(text) {
  const length = text.length || 1;

  const punctuationCount = (text.match(/、/g) || []).length;
  const spaceCount = (text.match(/ /g) || []).length;
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
  const hasKanjiNum = /[一二三四五六七八九十]/.test(text) ? 1 : 0;
  const hasArabicNum = /[0-9]/.test(text) ? 1 : 0;
  const mixedNumber = hasKanjiNum && hasArabicNum ? 1 : 0;

  const markdownSymbols = /[#*_`>-]/g;
  const markdownCount = (text.match(markdownSymbols) || []).length;
  const markdownRate = markdownCount / length;

  let aiScore = 50;
  let scoreChange = 0;

  const addScore = (val) => {
    aiScore += val;
    scoreChange += val;
  };

  addScore(punctuationRate * 15);
  addScore(spaceRate * 15);
  addScore(connectorCount * 2);
  addScore(sentenceEndSet.size * 1.5);
  addScore(bracketsCount * 1);
  addScore(mixedNumber * 3);
  addScore(markdownRate * 10);

  if (typeof runMorphologicalAnalysis === "function") {
    const morphemes = runMorphologicalAnalysis(text);
    if (morphemes && morphemes.length) {
      const nounRate = countMorpheme(morphemes, '名詞') / morphemes.length;

      // AIっぽい名詞率が高いと加点（AI度アップ）
      if (nounRate > 0.3) addScore(5);
      // 人間らしい名詞率なら減点（AI度ダウン）
      else if (nounRate > 0.1 && nounRate <= 0.3) addScore(-5);

      const particleUsage = analyzeParticleUsage(morphemes);
      if (particleUsage.has('について') && particleUsage.rate('によって') > 0.05) addScore(10);
    }
  }

  if (typeof countPhrases === "function") {
    const complexConnectors = ["その一方で", "したがって", "具体的には"];
    const complexConnectorCount = countPhrases(text, complexConnectors);
    addScore(complexConnectorCount * 5);

    const idioms = ["猫の手も借りたい", "雨後の筍"];
    const idiomCount = countPhrases(text, idioms);
    if (idiomCount > 0) addScore(-10); // 慣用句あれば減点→人間らしい
    else addScore(15);
  }

  if (typeof analyzeSentenceEndVariety === "function") {
    const sentenceEndVariety = analyzeSentenceEndVariety(text);
    // 文末のバリエーション多いほど人間らしい → AI度減点
    addScore(-sentenceEndVariety * 5);
  }

  if (scoreChange === 0) {
    addScore(-20);
  }

  if (aiScore > 100) aiScore = 100;
  if (aiScore < 0) aiScore = 0;

  const humanScore = 100 - aiScore;

  return {
    aiPercent: aiScore.toFixed(1),
    humanPercent: humanScore.toFixed(1),
  };
}