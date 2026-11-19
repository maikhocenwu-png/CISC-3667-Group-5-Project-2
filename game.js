
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
const POINTS_EXACT = 100;
const POINTS_TYPO = 75;

let availableLandmarks = landmarks.slice(); // create a copy of the landmarks array
let score = 0;
let round = 1;
let userInput;;

function pickRandomLandmark() {
  const randomIndex = Math.floor(Math.random() * availableLandmarks.length);
  const landmark = availableLandmarks[randomIndex];
  availableLandmarks.splice(randomIndex, 1);
  return landmark;
}

let randval = pickRandomLandmark();

const picture = document.getElementById("picture"); 
const feedback = document.getElementById("feedback"); 

picture.src = randval.image; // this is to pick a random picture in list and display it
document.getElementById("total").textContent = `Round: ${round} / ${ROUNDS}`; // this is to show the round number
document.getElementById("score").textContent = `Score: ${score}`; // show the score from the start

const textBox = document.createElement("input"); // the box that we will append to
textBox.type = "text"; //what kind of box
textBox.id = "answer"; //id for the box
textBox.placeholder = "Type the landmark name"; //placeholder text
document.getElementById("game").appendChild(textBox); //add after picture
textBox.focus();

textBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    userInput = textBox.value;

    const result = grade(userInput, randval.answers);

    if (result === "exact") {
      score += POINTS_EXACT;
      feedback.textContent = `Correct! +${POINTS_EXACT} points!`;
    } else if (result === "typo") {
      score += POINTS_TYPO;
      feedback.textContent = `Close, typo! +${POINTS_TYPO} points!`;
    } else {
      feedback.textContent = `Incorrect! The correct answer is: ${randval.answers[0]}`;
    }

    document.getElementById("score").textContent = `Score: ${score}`; // this is to show the score

    if (round >= ROUNDS) {
      picture.classList.add("hidden");
      textBox.classList.add("hidden");
      document.getElementById("finalScore").textContent = `Final Score: ${score} / ${ROUNDS * POINTS_EXACT}`;
      document.getElementById("end").classList.remove("hidden");
    } else {
      round += 1;
      randval = pickRandomLandmark();
      picture.src = randval.image;
      document.getElementById("total").textContent = `Round: ${round} / ${ROUNDS}`;
      textBox.value = "";
      textBox.focus();
    }
  }
});

document.getElementById("again").addEventListener("click", function () {
  location.reload(); // reloads the page to start a new game
});
