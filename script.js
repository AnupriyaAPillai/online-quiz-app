let quizData = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const questionNumberEl = document.getElementById("question-number");
const quizDiv = document.getElementById("quiz");
const categoryDiv = document.getElementById("category-selection");
const categoriesContainer = document.getElementById("categories");


const categoriesList = [
    {id:9, name:"General Knowledge"},
    {id:10, name:"Books"},
    {id:11, name:"Film"},
    {id:12, name:"Music"},
    {id:13, name:"Musicals & Theatre"},
    {id:14, name:"Television"},
    {id:15, name:"Video Games"},
    {id:16, name:"Board Games"},
    {id:17, name:"Science & Nature"},
    {id:18, name:"Computers"},
    {id:19, name:"Mathematics"},
    {id:20, name:"Mythology"},
    {id:21, name:"Sports"},
    {id:22, name:"Geography"},
    {id:23, name:"History"},
    {id:24, name:"Politics"},
    {id:25, name:"Art"},
    {id:26, name:"Celebrities"},
    {id:27, name:"Animals"},
    {id:28, name:"Vehicles"},
    {id:29, name:"Comics"},
    {id:30, name:"Gadgets"},
    {id:31, name:"Anime & Manga"},
    {id:32, name:"Cartoons & Animations"}
];


categoriesList.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat.name;
    btn.setAttribute("data-category", cat.id);
    btn.addEventListener("click", () => {
        categoryDiv.style.display = "none";
        quizDiv.style.display = "block";
        fetchQuestions(cat.id);
    });
    categoriesContainer.appendChild(btn);
});


async function fetchQuestions(category) {
    const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`);
    const data = await res.json();
    quizData = data.results.map(q => {
        const options = [...q.incorrect_answers, q.correct_answer];
        return {
            question: decodeHTML(q.question),
            options: shuffleArray(options.map(ans => decodeHTML(ans))),
            answer: decodeHTML(q.correct_answer)
        };
    });
    showQuestion();
}


function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


function shuffleArray(arr) {
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


function startTimer() {
    timeLeft = 30;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time Left: ${timeLeft}s`;
        if(timeLeft <= 0){
            clearInterval(timer);
            showNextQuestion();
        }
    }, 1000);
}


function showQuestion() {
    clearInterval(timer);
    startTimer();

    let q = quizData[currentQuestion];
    questionEl.textContent = q.question;
    questionNumberEl.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    optionsEl.innerHTML = "";

    q.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => selectAnswer(option));
        optionsEl.appendChild(button);
    });
}


function selectAnswer(selected) {
    let correct = quizData[currentQuestion].answer;
    if(selected === correct) {
        score++;
    }
    showNextQuestion();
}


function showNextQuestion() {
    currentQuestion++;
    if(currentQuestion < quizData.length){
        showQuestion();
    } else {
        clearInterval(timer);
        questionEl.textContent = "Quiz Completed!";
        optionsEl.innerHTML = "";
        timerEl.style.display = "none";
        nextBtn.style.display = "none";
        questionNumberEl.style.display = "none";
        scoreEl.textContent = `Your Score: ${score} / ${quizData.length}`;
    }
}

nextBtn.addEventListener("click", showNextQuestion);
