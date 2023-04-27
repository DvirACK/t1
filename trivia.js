const oscarFilmQuestionsData = [
    {
        question: "Which movie won the first-ever Best Picture Oscar?",
        options: {
            a: "All Quiet on the Western Front",
            b: "Gone with the Wind",
            c: "Wings"
        },
        correctOption: "c"
    },
    {
        question: "Which actor has won the most Oscars for Best Actor?",
        options: {
            a: "Jack Nicholson",
            b: "Daniel Day-Lewis",
            c: "Tom Hanks"
        },
        correctOption: "b"
    },
    {
        question: "What is the only horror film to win Best Picture?",
        options: {
            a: "The Silence of the Lambs",
            b: "Psycho",
            c: "Rosemary's Baby"
        },
        correctOption: "a"
    },
    {
        question: "Which film won the most Oscars without winning Best Picture?",
        options: {
            a: "Cabaret",
            b: "La La Land",
            c: "Gravity"
        },
        correctOption: "a"
    },
    {
        question: "Who is the youngest Best Actress winner?",
        options: {
            a: "Jennifer Lawrence",
            b: "Marlee Matlin",
            c: "Tatum O'Neal"
        },
        correctOption: "c"
    },
    {
        question: "Which film won Best Picture in 2020?",
        options: {
            a: "1917",
            b: "Joker",
            c: "Parasite"
        },
        correctOption: "c"
    },
    {
        question: "Who is the only actor to win an Oscar posthumously?",
        options: {
            a: "Heath Ledger",
            b: "James Dean",
            c: "Philip Seymour Hoffman"
        },
        correctOption: "a"
    },
    {
        question: "Which movie won Best Picture in 1995?",
        options: {
            a: "Forrest Gump",
            b: "Pulp Fiction",
            c: "Shawshank Redemption"
        },
        correctOption: "a"
    },
    {
        question: "What film won Best Picture, Best Director, Best Actor, and Best Actress in 1991?",
        options: {
            a: "The Silence of the Lambs",
            b: "Dances with Wolves",
            c: "Unforgiven"
        },
        correctOption: "a"
    },
    {
        question: "Which actress has the most Oscar nominations?",
        options: {
            a: "Meryl Streep",
            b: "Katharine Hepburn",
            c: "Cate Blanchett"
        },
        correctOption: "a"
    },
];



class TriviaGame {
    constructor(questionsData) {
        this.questionsData = questionsData;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.totalPoints = 0;
        this.timer = null;
        this.timeRemaining = 10;
        this.avgTimePerQuestion = 0;
    }

    // Add methods here

    // ... (constructor and properties)

    startGame() {
        this.showGameScreen();
        this.showNextQuestion();
    }

    showGameScreen() {
        document.querySelector('.intro-screen').hidden = true;
        document.querySelector('.game-screen').hidden = false;
    }

    showNextQuestion() {
        if (this.currentQuestionIndex < this.questionsData.length) {
            const questionData = this.questionsData[this.currentQuestionIndex];
            document.querySelector('.question').textContent = questionData.question;
            const answerButtons = document.querySelectorAll('.answer-btn');
            answerButtons.forEach((button, index) => {
                const option = String.fromCharCode(97 + index); // Convert 0, 1, 2 to 'a', 'b', 'c'
                button.textContent = questionData.options[option];
                button.dataset.correct = option === questionData.correctOption;
            });
            this.resetTimer();
            this.startTimer();
        } else {
            this.showSummaryScreen();
        }
    }

    showSummaryScreen() {
        this.stopTimer();
        document.querySelector('.game-screen').hidden = true;
        document.querySelector('.summary-screen').hidden = false;
        document.querySelector('.correct-answer-count').textContent = this.correctAnswers;
        document.querySelector('.total-points').textContent = this.totalPoints;
        document.querySelector('.avg-time-per-question').textContent = (this.avgTimePerQuestion / this.questionsData.length).toFixed(2);
    }

    // Add more methods here

    // ... (constructor, properties, and other methods)

    resetTimer() {
        this.timeRemaining = 10;
        this.updateProgressBar();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateProgressBar();
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.processAnswer(null);
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    updateProgressBar() {
        document.querySelector('.timer-progress').style.width = `${(this.timeRemaining / 10) * 100}%`;
    }

    processAnswer(isCorrect) {
        this.stopTimer();
        this.avgTimePerQuestion += 10 - this.timeRemaining;

        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach((button) => {
            const buttonIsCorrect = button.dataset.correct === "true";

            if (button.classList.contains('pressed')) {
                if (isCorrect) {
                    button.classList.add('correct');
                } else {
                    button.classList.add('incorrect');
                }
                button.disabled = true;
            }
        });

        // Find and highlight the correct answer
        const correctButton = Array.from(answerButtons).find(
            (btn) => btn.dataset.correct === "true"
        );
        correctButton.classList.add('correct');
        correctButton.disabled = true;

        if (isCorrect) {
            this.correctAnswers++;
            this.totalPoints += 10 + (2 * this.timeRemaining);
            document.querySelector('.score').textContent = `Score: ${this.totalPoints}`; // Update the score after every correct answer
        }

        setTimeout(() => {
            answerButtons.forEach((button) => {
                button.classList.remove('correct', 'incorrect');
                button.disabled = false;
            });

            this.currentQuestionIndex++;
            this.showNextQuestion();
        }, 2000);
    }





}

// end of game
//starts listenrs

document.querySelector('.start-btn').addEventListener('click', () => {
    const game = new TriviaGame(questionsData);
    game.startGame();

    document.querySelectorAll('.answer-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
            const button = event.target;
            button.classList.add('pressed');

            setTimeout(() => {
                button.classList.remove('pressed');
                const isCorrect = button.dataset.correct === "true";
                game.processAnswer(isCorrect);
            }, 750);
        });
    });

});

document.querySelector('.share-btn').addEventListener('click', () => {
    const shareText = `I scored ${document.querySelector('.total-points').textContent} points in the Trivia Game! Can you beat my score?`;
    const shareUrl = 'https://www.gptpuzzle.com/blog/categories/trivia';

    if (navigator.share) {
        navigator.share({
            title: 'Trivia Game',
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback for browsers that don't support the Web Share API
        prompt('Copy the link below to share the game:', shareUrl);
    }
});


