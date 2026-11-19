
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


const $ = (id) => document.getElementById(id);
const S = { phase: "name", pin: null, cur: null, diff: "easy" };

const ROUNDS = 5;
const POINTS_EXACT = 100; // Hard: typed it right
const POINTS_TYPO = 75; // Hard: typed it with a small typo
const POINTS_EASY = 50; // Easy: picked the right choice
const POINTS_MAP = 100; // most you can earn for the pin

let difficulty = "easy"; // "easy" or "hard"
let availableLandmarks = [];
let score = 0;
let round = 1;
let randval = null;
let roundPoints = 0; // points earned by naming the landmark this round

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
const mapBox = document.getElementById("mapPage");
const confirmBtn = document.getElementById("confirm");
const nextBtn = document.getElementById("nextRound");
const mapInfo = document.getElementById("mapInfo");

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
  mapBox.classList.add("hidden");
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

// The naming part is done: add its points, then show the map page.
function finishRound(points, message) {
  score += points;
  roundPoints = points;
  feedback.textContent = message;
  document.getElementById("score").textContent = `Score: ${score}`;
  showMap();
}


// map part
// Distance in km between two places on Earth (haversine formula).
function km(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Pin points: full points for a very close pin, fewer as it gets farther away.
function mapPoints(distance) {
  if (distance < 25) {
    return POINTS_MAP;
  }
  return Math.round(POINTS_MAP * Math.exp(-distance / 1500));
}

// Show page 2: the map where the player drops a pin.
// (mapLabels.js draws the map and handles clicking, dragging and zooming.)
function showMap() {
  S.cur = randval;
  S.pin = null;
  S.phase = "pin"; // mapLabels.js only accepts clicks in this phase
  S.diff = difficulty; // Easy shows names on the map, Hard does not
  playBox.classList.add("hidden");
  mapBox.classList.remove("hidden");
  document.getElementById("mapQuestion").textContent = `Where is the ${randval.name}?`;
  mapInfo.textContent = "Click the map to drop your pin. Drag to move, scroll or +/- to zoom.";
  confirmBtn.disabled = true;
  confirmBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  measure(); // measure the map's size now that it is visible
  setView(homeView()); // show the whole world
}

// "Confirm pin": measure the distance, give points, show the answer.
confirmBtn.addEventListener("click", function () {
  S.phase = "reveal"; // no more pin changes
  const distance = km(S.pin.lat, S.pin.lon, randval.lat, randval.lon);
  const points = mapPoints(distance);
  score += points;
  document.getElementById("score").textContent = `Score: ${score}`;

  drawMarkers(); // red = real place, blue = your pin
  // zoom the map so both pins are in view
  animateTo(fitTo([toXY(S.pin.lat, S.pin.lon), toXY(randval.lat, randval.lon)]), 900);
  mapInfo.textContent =
    `Your pin was ${Math.round(distance).toLocaleString()} km away. ` +
    `+${points} points! (This round: ${roundPoints + points})`;
  confirmBtn.classList.add("hidden");
  nextBtn.textContent = round >= ROUNDS ? "See final score" : "Next landmark";
  nextBtn.classList.remove("hidden");
});

// "Next": go to the next round, or to the end.
nextBtn.addEventListener("click", function () {
  mapBox.classList.add("hidden");
  if (round >= ROUNDS) {
    const best = (difficulty === "easy" ? POINTS_EASY : POINTS_EXACT) + POINTS_MAP;
    document.getElementById("finalScore").textContent = `Final Score: ${score} / ${ROUNDS * best}`;
    endBox.classList.remove("hidden");
  } else {
    round += 1;
    playBox.classList.remove("hidden");
    showRound();
  }
});

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
