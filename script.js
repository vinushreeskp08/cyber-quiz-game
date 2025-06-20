const levels = {
  easy: [
    {
      question: "🔑 What is a good example of a strong password?",
      options: ["password", "123456", "Vinu@2025$", "qwerty"],
      answer: "Vinu@2025$"
    },
    {
      question: "📧 Which is a phishing attempt?",
      options: ["Email from HR", "Email asking for credentials", "Newsletter", "Bank statement"],
      answer: "Email asking for credentials"
    }
  ],
  medium: [
    {
      question: "💣 What does ransomware do?",
      options: ["Speeds up PC", "Encrypts files for ransom", "Fixes bugs", "Deletes viruses"],
      answer: "Encrypts files for ransom"
    },
    {
      question: "🔍 Which tool is used to scan websites for vulnerabilities?",
      options: ["Paint", "Notepad", "OWASP ZAP", "Excel"],
      answer: "OWASP ZAP"
    }
  ],
  hard: [
    {
      question: "💀 What port does HTTPS use?",
      options: ["21", "25", "443", "8080"],
      answer: "443"
    },
    {
      question: "🛡 What’s the best defense against phishing?",
      options: ["Ignore emails", "Use antivirus", "Security awareness", "Incognito mode"],
      answer: "Security awareness"
    }
  ]
};

let currentLevel = 'easy';
let questionPool = [];
let current = 0;
let score = 0;
let timer;
let timeLeft = 15;
let userName = "";
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const bgMusic = document.getElementById("bgMusic");
let musicMuted = false;

function startGame() {
  const input = document.getElementById("username").value.trim();
  if (!input) return alert("Please enter your name!");

  userName = input;
  document.getElementById("user-login").style.display = "none";
  document.getElementById("quiz-content").style.display = "block";
  setLevel("easy");
  showHighScore();
}

function setLevel(level) {
  currentLevel = level;
  questionPool = shuffle([...levels[level]]);
  current = 0;
  score = 0;
  loadQuestion();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
  timeLeft = 15;
  document.getElementById("time").innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      wrongSound.play();
      showFeedback("💀 Time's up!", false);
    }
  }, 1000);
}

function loadQuestion() {
  clearInterval(timer);
  startTimer();
  document.getElementById("feedback").innerText = "";
  document.getElementById("badge-display").innerHTML = "";
  document.getElementById("score").innerText = `Score: ${score}/${questionPool.length}`;
  document.getElementById("progress-bar").style.width = ((current) / questionPool.length * 100) + "%";

  const q = questionPool[current];
  document.getElementById("question").innerText = q.question;
  const optionsBox = document.getElementById("options");
  optionsBox.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(option);
    optionsBox.appendChild(btn);
  });
}

function checkAnswer(selected) {
  clearInterval(timer);
  const correct = questionPool[current].answer;
  if (selected === correct) {
    score++;
    correctSound.play();
    showFeedback("✅ Correct!", true);
  } else {
    wrongSound.play();
    showFeedback(`❌ Correct: ${correct}`, false);
  }
}

function showFeedback(message, isCorrect) {
  const box = document.getElementById("feedback");
  box.innerText = message;
  box.style.color = isCorrect ? "#00ff00" : "#ff4444";
}

function nextQuestion() {
  current++;
  if (current < questionPool.length) {
    loadQuestion();
  } else {
    clearInterval(timer);
    document.getElementById("question").innerText = `🎉 ${userName}, you completed the quiz!`;
    document.getElementById("options").innerHTML = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("score").innerText = `Final Score: ${score}/${questionPool.length}`;
    document.getElementById("progress-bar").style.width = "100%";
    showBadge();
    checkHighScore();
  }
}

function showBadge() {
  const percent = (score / questionPool.length) * 100;
  const badge = document.getElementById("badge-display");
  if (percent >= 90) badge.innerHTML = "🏅 <b>GOLD Badge</b> – You’re a Cyber Master!";
  else if (percent >= 70) badge.innerHTML = "🥈 <b>SILVER Badge</b> – Great Job!";
  else if (percent >= 50) badge.innerHTML = "🥉 <b>BRONZE Badge</b> – Not bad!";
  else badge.innerHTML = "😅 No badge – Train harder!";
}

function checkHighScore() {
  const key = `highScore_${userName}_${currentLevel}`;
  const prevHigh = localStorage.getItem(key);
  if (!prevHigh || score > parseInt(prevHigh)) {
    localStorage.setItem(key, score);
    document.getElementById("high-score").innerText = "🥇 New High Score!";
  } else {
    document.getElementById("high-score").innerText = `📊 High Score: ${prevHigh}`;
  }
}

function showHighScore() {
  const key = `highScore_${userName}_${currentLevel}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    document.getElementById("high-score").innerText = `📊 High Score: ${saved}`;
  }
}

function toggleMusic() {
  musicMuted = !musicMuted;
  bgMusic.muted = musicMuted;
  document.getElementById("music-btn").innerText = musicMuted ? "🔇 Unmute Music" : "🎵 Mute Music";
}
