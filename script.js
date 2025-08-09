// kuromoji.jsの初期化
let tokenizer = null;
kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/" }).build(function (err, _tokenizer) {
    if (err) {
        console.error("kuromoji.jsの初期化に失敗しました:", err);
        return;
    }
    tokenizer = _tokenizer;
});

// 形態素解析を実行するヘルパー関数
function runMorphologicalAnalysis(text) {
    if (!tokenizer) {
        console.error("kuromoji.jsが初期化されていません。");
        return null;
    }
    return tokenizer.tokenize(text);
}

// 形態素をカウントするヘルパー関数
function countMorpheme(morphemes, partOfSpeech) {
    return morphemes.filter(m => m.pos === partOfSpeech).length;
}

// 特定の助詞の利用率を分析するヘルパー関数
function analyzeParticleUsage(morphemes) {
    const totalParticles = morphemes.filter(m => m.pos === '助詞').length;
    const usage = new Map();
    morphemes.forEach(m => {
        if (m.pos === '助詞') {
            const surface = m.surface_form;
            usage.set(surface, (usage.get(surface) || 0) + 1);
        }
    });

    return {
        has: (key) => usage.has(key),
        rate: (key) => (usage.get(key) || 0) / (totalParticles || 1)
    };
}

// 特定のフレーズをカウントするヘルパー関数
function countPhrases(text, phrases) {
    let count = 0;
    phrases.forEach(phrase => {
        const regex = new RegExp(phrase, "g");
        count += (text.match(regex) || []).length;
    });
    return count;
}

// 文末表現の多様性を分析するヘルパー関数
function analyzeSentenceEndVariety(text) {
    const sentences = text.split(/[。！？]/);
    const uniqueEnds = new Set();
    sentences.forEach(s => {
        s = s.trim();
        if (s.length > 0) {
            const lastTwoChars = s.slice(-2);
            uniqueEnds.add(lastTwoChars);
        }
    });
    return uniqueEnds.size;
}

/**
 * 日本語の文章を分析し、AIが生成した可能性を判定します。
 * @param {string} text - 分析する日本語のテキスト
 * @returns {{aiPercent: string, humanPercent: string}} - AI度と人間度のパーセンテージ
 */
function analyzeAIStyle(text) {
    const length = text.length || 1;
    let aiScore = 50;

    // スコア調整を統一的に行うヘルパー関数
    const addScore = (key, value) => {
        const weights = {
            'punctuationRate': 20,
            'spaceRate': 20,
            'connectorCount': 10,
            'sentenceEndSetSize': 5,
            'bracketsCount': 3,
            'mixedNumber': 8,
            'markdownRate': 15,
            'nounRateAI': 25,
            'nounRateHuman': 25,
            'particleUsageAI': 30,
            'complexConnectors': 20,
            'idiomCount': 30,
            'sentenceEndVariety': 15
        };
        const weight = weights[key] || 1;
        aiScore += value * weight;
    };

    // 1. 基本的な文字・記号の分析
    const punctuationRate = (text.match(/、/g) || []).length / length;
    const spaceRate = (text.match(/ /g) || []).length / length;
    const connectors = ["しかし", "だから", "つまり", "そして", "ところで"];
    const connectorCount = countPhrases(text, connectors);
    const sentenceEnds = ["です", "ます", "だ", "である", "か？"];
    const sentenceEndSet = new Set(sentenceEnds.filter(end => text.includes(end)));
    const bracketsCount = (text.match(/[（）]/g) || []).length;
    const hasKanjiNum = /[一二三四五六七八九十]/.test(text) ? 1 : 0;
    const hasArabicNum = /[0-9]/.test(text) ? 1 : 0;
    const mixedNumber = hasKanjiNum && hasArabicNum ? 1 : 0;
    const markdownSymbols = /[#*_`>-]/g;
    const markdownCount = (text.match(markdownSymbols) || []).length;
    const markdownRate = markdownCount / length;

    addScore('punctuationRate', punctuationRate > 0.01 ? 1 : -1);
    addScore('spaceRate', spaceRate > 0.01 ? 1 : -1);
    addScore('connectorCount', connectorCount > 0 ? 1 : -1);
    addScore('sentenceEndSetSize', sentenceEndSet.size > 2 ? -1 : 1);
    addScore('bracketsCount', bracketsCount > 2 ? 1 : -1);
    addScore('mixedNumber', mixedNumber > 0 ? 1 : -1);
    addScore('markdownRate', markdownRate > 0.01 ? 1 : -1);
    
    // 2. 形態素解析による高度な分析
    const morphemes = runMorphologicalAnalysis(text);
    if (morphemes && morphemes.length > 10) {
        // 名詞の偏り
        const nounRate = countMorpheme(morphemes, '名詞') / morphemes.length;
        if (nounRate > 0.4) addScore('nounRateAI', 1); // 名詞率が高すぎるとAI的
        else if (nounRate < 0.2) addScore('nounRateHuman', 1); // 低すぎても不自然（人間は多様）
        else addScore('nounRateAI', -1);

        // 助詞の偏り
        const particleUsage = analyzeParticleUsage(morphemes);
        if (particleUsage.rate('について') > 0.05 || particleUsage.rate('によって') > 0.05) {
            addScore('particleUsageAI', 1); // 特定の助詞の多用はAI的
        } else {
            addScore('particleUsageAI', -1);
        }
        
        // 慣用句の有無
        const idioms = ["猫の手も借りたい", "雨後の筍", "情けは人のためならず"];
        const idiomCount = countPhrases(text, idioms);
        addScore('idiomCount', idiomCount > 0 ? -1 : 1); // 慣用句があれば大きく減点

        // 文末表現の多様性
        const sentenceEndVariety = analyzeSentenceEndVariety(text);
        if (sentenceEndVariety < 3) addScore('sentenceEndVariety', 1); // バリエーションが少ないとAI的
        else addScore('sentenceEndVariety', -1);
        
        // 論理的接続詞の検出
        const complexConnectors = ["その一方で", "したがって", "具体的には", "一般的に"];
        const complexConnectorCount = countPhrases(text, complexConnectors);
        addScore('complexConnectors', complexConnectorCount > 0 ? 1 : -1);
    } else {
        // 短すぎる文章は判定が難しいため、スコアを調整
        addScore('shortText', -15);
    }
    
    // スコアの最終調整
    aiScore = Math.max(0, Math.min(100, aiScore));
    const humanScore = 100 - aiScore;

    return {
        aiPercent: aiScore.toFixed(1),
        humanPercent: humanScore.toFixed(1),
    };
}

document.getElementById("analyzeBtn").addEventListener("click", () => {
    const text = document.getElementById("inputText").value.trim();
    if (!text || !tokenizer) {
        alert("文章を入力するか、kuromoji.jsの読み込みを待ってください。");
        return;
    }
    const result = analyzeAIStyle(text);
    document.getElementById("aiScore").textContent = result.aiPercent;
    document.getElementById("humanScore").textContent = result.humanPercent;
    document.getElementById("result").style.display = "block";
});

