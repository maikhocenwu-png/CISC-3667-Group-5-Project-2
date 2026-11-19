
// Normalize the string to remove accents, special characters, and convert to lowercase
function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .replace(/^the /, "") // remove "the" from the beginning of the string 
    .trim();
}


// spell check function to check if the user input is close enough to the correct answer
function distance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) {
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[len1][len2];
} 

// grade function to check if the user input is correct, a typo, or wrong
function grade(input, answer) {
  const guess = normalizeString(input);
  if (guess === "") {
    return "wrong"; // empty input is considered wrong
  }

  let result = "wrong";
  for (const ans of answer) {
    const target = normalizeString(ans);
    if (guess === target) {
      return "exact"; // exact match
    }
    let allow = 0;// allow for some leniency in spelling
    if (ans.length >= 12) {
      allow = 2;
    } else if (ans.length >= 6) { 
      allow = 1;
    }
    if (distance(guess,target) <= allow) {
      result = "typo";  
    } 
  }
  return result;
}

const ROUNDS = 5;
const POINTS_EXACT = 100; // Hard: typed it right
const POINTS_TYPO = 75; // Hard: typed it with a small typo
const POINTS_EASY = 50; // Easy: picked the right choice

let difficulty = "easy"; // "easy" or "hard"
let availableLandmarks = [];
let score = 0;
let round = 1;
let randval = null;

// Return a shuffled copy of a list.
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandomLandmark() {
  const randomIndex = Math.floor(Math.random() * availableLandmarks.length);
  const landmark = availableLandmarks[randomIndex];
  availableLandmarks.splice(randomIndex, 1);
  return landmark;
}

const startBox = document.getElementById("start");
const playBox = document.getElementById("play");
const endBox = document.getElementById("end");
const picture = document.getElementById("picture");
const feedback = document.getElementById("feedback");
const optionsBox = document.getElementById("options");

const textBox = document.createElement("input"); // the box for Hard mode
textBox.type = "text"; //what kind of box
textBox.id = "answer"; //id for the box
textBox.placeholder = "Type the landmark name"; //placeholder text
playBox.appendChild(textBox); //add inside the game area

// Start a new game.
function startGame(chosen) {
  difficulty = chosen; // "easy" or "hard", from the button you clicked
  availableLandmarks = landmarks.slice(); // reset the available landmarks
  score = 0;
  round = 1;
  startBox.classList.add("hidden");
  endBox.classList.add("hidden");
  playBox.classList.remove("hidden");
  feedback.textContent = "";
  document.getElementById("score").textContent = `Score: ${score}`;
  showRound();
}

// Show the current round's landmark and either the options or the text box.
function showRound() {
  randval = pickRandomLandmark();
  picture.src = randval.image;
  document.getElementById("total").textContent = `Round: ${round} / ${ROUNDS}`;

  if (difficulty === "easy") {
    textBox.classList.add("hidden");
    optionsBox.classList.remove("hidden");
    showOptions();
  } else {
    optionsBox.classList.add("hidden");
    textBox.classList.remove("hidden");
    textBox.value = "";
    textBox.focus();
  }
}

// Easy mode: multiple choice
function showOptions() {
  const others = shuffle(landmarks.filter((l) => l !== randval)).slice(0, 3);
  const choices = shuffle([randval, ...others]);

  optionsBox.innerHTML = "";
  for (const choice of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = choice.name;
    button.addEventListener("click", function () {
      if (choice === randval) {
        finishRound(POINTS_EASY, `Correct! +${POINTS_EASY} points!`);
      } else {
        finishRound(0, `Incorrect! The correct answer is: ${randval.name}`);
      }
    });
    optionsBox.appendChild(button);
  }
}

// Add points, show a message, then go to the next round or the end.
function finishRound(points, message) {
  score += points;
  feedback.textContent = message;
  document.getElementById("score").textContent = `Score: ${score}`;

  if (round >= ROUNDS) {
    const best = difficulty === "easy" ? POINTS_EASY : POINTS_EXACT;
    playBox.classList.add("hidden");
    document.getElementById("finalScore").textContent = `Final Score: ${score} / ${ROUNDS * best}`;
    endBox.classList.remove("hidden");
  } else {
    round += 1;
    showRound();
  }
}

// Hard mode: type the answer.
textBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const result = grade(textBox.value, randval.answers);

    if (result === "exact") {
      finishRound(POINTS_EXACT, `Correct! +${POINTS_EXACT} points!`);
    } else if (result === "typo") {
      finishRound(POINTS_TYPO, `Close, typo! +${POINTS_TYPO} points!`);
    } else {
      finishRound(0, `Incorrect! The correct answer is: ${randval.answers[0]}`);
    }
  }
});

document.getElementById("easyBtn").addEventListener("click", function () {
  startGame("easy");
});

document.getElementById("hardBtn").addEventListener("click", function () {
  startGame("hard");
});

document.getElementById("again").addEventListener("click", function () {
  location.reload(); // reloads the page to go back to the start screen
});
