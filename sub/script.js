document.addEventListener('DOMContentLoaded', () => {
    // HTML要素の取得
    const levelSelectionContainer = document.getElementById('level-selection-container');
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    const currentQuestionInfo = document.getElementById('current-question-info');
    const resultText = document.getElementById('result-text');
    const correctCountDisplay = document.getElementById('correct-count');
    const restartButton = document.getElementById('restart-button');
    const streakCountDisplay = document.getElementById('streak-count');
    const bestStreakCountDisplay = document.getElementById('best-streak-count');
    const levelButtons = document.querySelectorAll('.level-button');

    // main.jsに定義されたWARS_DATAを使用
    let allQuestions = WARS_DATA;
    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let correctAnswersInRow = 0;
    let totalQuestions;
    
    // ローカルストレージから記録をロード
    let bestStreak = localStorage.getItem('bestStreak') ? parseInt(localStorage.getItem('bestStreak')) : 0;
    bestStreakCountDisplay.textContent = `過去最高の記録: ${bestStreak}`;

    // 配列をシャッフルする関数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 問題を生成する関数
    function createQuizQuestions(numQuestions) {
        const shuffledData = shuffleArray([...allQuestions]);
        const newQuizQuestions = [];
        shuffledData.forEach(correctItem => {
            if (newQuizQuestions.length >= numQuestions) return;

            const choices = [correctItem];
            const otherItems = allQuestions.filter(item => item.id !== correctItem.id);
            const shuffledOtherItems = shuffleArray(otherItems);

            // 選択肢を3つ選ぶ
            for (let i = 0; i < 3; i++) {
                if (shuffledOtherItems[i]) {
                    choices.push(shuffledOtherItems[i]);
                }
            }
            
            newQuizQuestions.push({
                question: `「${correctItem.title}」について、最も適切な説明はどれ？`,
                correctId: correctItem.id,
                choices: shuffleArray(choices)
            });
        });
        return newQuizQuestions;
    }

    // レベル選択ボタンのイベントリスナー
    levelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const level = e.target.dataset.level;
            if (level === 'easy') {
                totalQuestions = 10;
            } else if (level === 'medium') {
                totalQuestions = 15;
            } else {
                totalQuestions = 20;
            }
            quizQuestions = createQuizQuestions(totalQuestions);
            levelSelectionContainer.classList.add('hidden');
            quizContainer.classList.remove('hidden');
            displayQuestion();
        });
    });

    // 問題を表示する関数
    function displayQuestion() {
        if (currentQuestionIndex >= totalQuestions) {
            showResult();
            return;
        }
        
        resetState();
        const currentQuiz = quizQuestions[currentQuestionIndex];
        questionText.textContent = currentQuiz.question;
        currentQuestionInfo.textContent = `第 ${currentQuestionIndex + 1} 問 / 全 ${totalQuestions} 問`;
        
        currentQuiz.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.title;
            button.classList.add('choice-button');
            button.dataset.id = choice.id;
            choicesContainer.appendChild(button);
        });

        choicesContainer.addEventListener('click', handleAnswer);
    }

    // 回答を処理する関数
    function handleAnswer(e) {
        const selectedButton = e.target.closest('.choice-button');
        if (!selectedButton) return;
        
        choicesContainer.removeEventListener('click', handleAnswer);
        const selectedId = parseInt(selectedButton.dataset.id);
        const currentQuiz = quizQuestions[currentQuestionIndex];
        
        if (selectedId === currentQuiz.correctId) {
            selectedButton.classList.add('correct');
            correctAnswersInRow++;
        } else {
            selectedButton.classList.add('incorrect');
            const correctButton = Array.from(choicesContainer.children).find(btn => parseInt(btn.dataset.id) === currentQuiz.correctId);
            if (correctButton) {
                correctButton.classList.add('correct');
            }
            // 連続正解が途切れた
            if (correctAnswersInRow > bestStreak) {
                bestStreak = correctAnswersInRow;
                localStorage.setItem('bestStreak', bestStreak);
                bestStreakCountDisplay.textContent = `過去最高の記録: ${bestStreak}`;
            }
            correctAnswersInRow = 0;
        }

        streakCountDisplay.textContent = `現在の連続正解記録: ${correctAnswersInRow}`;

        // 次の問題へ進むための遅延
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500);
    }

    // 状態をリセットする関数
    function resetState() {
        while (choicesContainer.firstChild) {
            choicesContainer.removeChild(choicesContainer.firstChild);
        }
    }

    // 結果を表示する関数
    function showResult() {
        // 全問正解で連続記録を更新
        if (correctAnswersInRow > bestStreak) {
            bestStreak = correctAnswersInRow;
            localStorage.setItem('bestStreak', bestStreak);
        }

        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        resultText.textContent = `クイズ終了！`;
        correctCountDisplay.textContent = `あなたの連続正解記録は ${correctAnswersInRow} です。`;
        bestStreakCountDisplay.textContent = `過去最高の記録: ${bestStreak}`;
    }

    // もう一度プレイボタンのイベントリスナー
    restartButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        correctAnswersInRow = 0;
        streakCountDisplay.textContent = `現在の連続正解記録: 0`;
        resultContainer.classList.add('hidden');
        levelSelectionContainer.classList.remove('hidden');
    });
});
