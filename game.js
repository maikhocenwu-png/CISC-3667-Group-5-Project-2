
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
const S = { phase: "name", pin: null, cur: null, diff: "easy", hint: null };

let ROUNDS = 5;
const POINTS_EXACT = 100; // Hard: typed it right
const POINTS_TYPO = 75; // Hard: typed it with a small typo
const POINTS_EASY = 50; // Easy: picked the right choice
const POINTS_MAP = 100; // most you can earn for the pin
const HINT_COST = 10; // Hard: each letter hint costs this many points
const MAX_HINTS = 5; // Hard: at most this many letter hints per round
const AREA_HINT_COST = 25; // Easy: showing the dashed circle costs this many points

let difficulty = "easy"; // "easy" or "hard"
let availableLandmarks = [];
let score = 0;
let round = 1;
let randval = null;
let roundPoints = 0; // points earned by naming the landmark this round
let answered = false; // true once this round's name question is answered (stops double scoring)
let hintsUsed = 0; // Hard: letter hints used this round
let hintMask = []; // Hard: which letters of the name are revealed
let roundLog = []; // one entry per finished round, used for the summary on the end screen
let cur = null; // the entry for the round being played
let hintName = ""; // Hard: the name the hint is built from
let areaHintUsed = false; // Easy: did the player click the circle hint this round?

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
const toMapBtn = document.getElementById("toMap");
const infoBox = document.getElementById("infoPage");
const infoNext = document.getElementById("infoNext");
const mapInfo = document.getElementById("mapInfo");
const hintBox = document.getElementById("hintBox");
const hintText = document.getElementById("hintText");
const hintBtn = document.getElementById("hintBtn");
const areaHintBtn = document.getElementById("areaHintBtn");

const textBox = document.createElement("input"); // the box for Hard mode
textBox.type = "text"; //what kind of box
textBox.id = "answer"; //id for the box
textBox.placeholder = "Type the landmark name"; //placeholder text
playBox.insertBefore(textBox, hintBox); //add inside the game area, above the hint

// Start a new game.
function startGame(chosen) {
  difficulty = chosen; // "easy" or "hard", from the button you clicked
  availableLandmarks = landmarks.slice(); // reset the available landmarks
  score = 0;
  round = 1;
  roundLog = [];
  startBox.classList.add("hidden");
  endBox.classList.add("hidden");
  mapBox.classList.add("hidden");
  infoBox.classList.add("hidden");
  playBox.classList.remove("hidden");
  feedback.textContent = "";
  document.getElementById("score").textContent = `Score: ${score}`;
  showRound();
}

// Show the current round's landmark and either the options or the text box.
function showRound() {
  randval = pickRandomLandmark();
  picture.src = randval.image;
  feedback.textContent = "";
  toMapBtn.classList.add("hidden");
  textBox.disabled = false; // unlock typing (it is locked after you answer)
  answered = false; // a new round: allow one answer again
  // start this round's record for the end-screen summary
  cur = { name: randval.name, answer: "", result: "", namePts: 0, letterHints: 0, letterLost: 0, circle: false, circleLost: 0, km: null, pinPts: 0 };
  document.getElementById("total").textContent = `Round: ${round} / ${ROUNDS}`;

  if (difficulty === "easy") {
    textBox.classList.add("hidden");
    optionsBox.classList.remove("hidden");
    hintBox.classList.add("hidden");
    showOptions();
  } else {
    optionsBox.classList.add("hidden");
    textBox.classList.remove("hidden");
    textBox.value = "";
    startHints();
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
      if (!answered) {
        cur.answer = choice.name; // remember what was picked
        cur.result = choice === randval ? "Correct" : "Wrong";
      }

      // Highlight the correct answer in green, and the wrong answer in red.
      for (const other of optionsBox.querySelectorAll("button")) {
        if (other.textContent === randval.name) {
          other.classList.add("correct");
        }
      }
      if (choice !== randval) {
        button.classList.add("wrong");
      }

      if (choice === randval) {
        finishRound(POINTS_EASY, `Correct! +${POINTS_EASY} points!`);
      } else {
        finishRound(0, `Incorrect! The correct answer is: ${randval.name}`);
      }
    });
    optionsBox.appendChild(button);
  }
}


function finishRound(points, message) {
  if (answered) {
    return; 
  }
  answered = true;
  cur.namePts = points;
  score += points;
  roundPoints = points;
  feedback.textContent = message;
  document.getElementById("score").textContent = `Score: ${score}`;

  textBox.disabled = true;
  for (const b of optionsBox.querySelectorAll("button")) {
    b.disabled = true;
  }
  hintBtn.disabled = true;
  toMapBtn.classList.remove("hidden");
}

toMapBtn.addEventListener("click", showMap);

//letter hint
function hintPattern() {
  return hintName
    .split("")
    .map((ch, i) => {
      if (ch === " ") return " "; // keep a gap between words
      return hintMask[i] ? ch.toUpperCase() : "_";
    })
    .join(" ");
}

function updateHintUI() {
  hintText.textContent = hintPattern();
  const left = Math.min(MAX_HINTS, hintMax) - hintsUsed;
  hintBtn.textContent = left > 0 ? `Reveal a letter (-${HINT_COST} points) · ${left} left` : "No hints left";
  hintBtn.disabled = left <= 0 || answered;
}

let hintMax = 0; // how many hints this round's name allows

function startHints() {
  hintsUsed = 0;
  hintName = randval.name.replace(/\s*\(.*?\)/g, "").trim();
  hintMask = hintName.split("").map((ch) => ch === " " || !/[a-z0-9]/i.test(ch)); 
  const letters = hintName.split("").filter((ch) => /[a-z0-9]/i.test(ch)).length;
  hintMax = Math.min(MAX_HINTS, Math.floor(letters / 2));
  hintBox.classList.remove("hidden");
  updateHintUI();
}

hintBtn.addEventListener("click", function () {
  if (answered || hintsUsed >= hintMax) {
    return;
  }
  const hidden = [];
  hintMask.forEach((shown, i) => {
    if (!shown) hidden.push(i);
  });
  const pick = hidden[Math.floor(Math.random() * hidden.length)];
  hintMask[pick] = true;
  hintsUsed += 1;
  updateHintUI();
  textBox.focus(); 
});

// Points for naming, after hints: each hint costs HINT_COST, never below 0.
function afterHints(points) {
  return Math.max(0, points - hintsUsed * HINT_COST);
}

// Text for the feedback line, e.g. "(2 hints: -20)".
function hintNote() {
  return hintsUsed > 0 ? ` (${hintsUsed} hint${hintsUsed > 1 ? "s" : ""}: -${hintsUsed * HINT_COST})` : "";
}

// dash cricle creation
const AREAS = {
  "North America": { lat: 38, lon: -98, r: 40 },
  "South America": { lat: -15, lon: -60, r: 33 },
  Europe: { lat: 50, lon: 15, r: 26 },
  Africa: { lat: 2, lon: 20, r: 40 },
  Asia: { lat: 32, lon: 90, r: 58 },
  "the South Pacific": { lat: -20, lon: -120, r: 28 },
};

// country use in landmark list
const CONTINENT_OF = {
  "United States": "North America",
  Canada: "North America",
  Panama: "North America",
  Peru: "South America",
  Brazil: "South America",
  Bolivia: "South America",
  France: "Europe",
  Italy: "Europe",
  "United Kingdom": "Europe",
  Germany: "Europe",
  Greece: "Europe",
  Egypt: "Africa",
  India: "Asia",
  China: "Asia",
  Jordan: "Asia",
  Japan: "Asia",
  Nepal: "Asia",
};

// Easter Island is in Chile but far out in the Pacific, so it gets its own area.
const AREA_OVERRIDE = { "Easter Island (Moai)": "the South Pacific" };

// Returns { name, lat, lon, r } for a landmark, or null if we don't know.
function hintArea(landmark) {
  const first = landmark.country.split(/ \/ | \(/)[0].trim();
  const name = AREA_OVERRIDE[landmark.name] || CONTINENT_OF[first];
  return name ? { name, ...AREAS[name] } : null;
}


// Map part
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

//  part where the player drops a pin.
// (mapLabels.js draws the map and handles clicking, dragging and zooming.)
function showMap() {
  S.cur = randval;
  S.pin = null;
  S.phase = "pin"; // mapLabels.js only accepts clicks in this phase
  S.diff = difficulty; // Easy shows names on the map, Hard does not
  S.hint = null; // the dashed circle only appears if the player clicks the hint button (Easy)
  areaHintUsed = false;
  areaHintBtn.disabled = false;
  areaHintBtn.textContent = `Show a hint: continent (-${AREA_HINT_COST} points)`;
  areaHintBtn.classList.remove("hidden"); // Easy and Hard both get the continent hint
  playBox.classList.add("hidden");
  mapBox.classList.remove("hidden");
  document.getElementById("mapQuestion").textContent = `Where is the ${randval.name}?`;
  mapInfo.textContent = "Click the map to drop your pin. Drag to move, scroll or +/- to zoom.";
  confirmBtn.disabled = true;
  confirmBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  cancelAnimationFrame(anim); // stop any zoom animation left over from the last round
  measure(); // measure the map's size now that it is visible
  setView(homeView()); // show the whole world
}

// Easy hint button: reveal the dashed circle, costs points.
areaHintBtn.addEventListener("click", function () {
  if (S.phase !== "pin" || areaHintUsed) {
    return;
  }
  areaHintUsed = true;
  S.hint = hintArea(randval); // mapLabels.js draws the circle when S.hint is set
  drawMarkers();
  areaHintBtn.disabled = true;
  areaHintBtn.textContent = `Hint used (-${AREA_HINT_COST} points)`;
  mapInfo.textContent = `Hint: it is somewhere inside the dashed circle (${S.hint.name}). Click the map to drop your pin.`;
});

// "Confirm pin": measure the distance, give points, show the answer.
confirmBtn.addEventListener("click", function () {
  if (S.phase !== "pin" || !S.pin) {
    return; // already confirmed (or no pin yet): don't score twice
  }
  S.phase = "reveal"; // no more pin changes
  const distance = km(S.pin.lat, S.pin.lon, randval.lat, randval.lon);
  let points = mapPoints(distance);
  const pinFull = points; // pin points before the hint cost
  if (areaHintUsed) {
    points = Math.max(0, points - AREA_HINT_COST); // the circle hint costs points
  }
  score += points;
  document.getElementById("score").textContent = `Score: ${score}`;
  // save this round for the summary
  cur.km = distance;
  cur.pinPts = points;
  cur.circle = areaHintUsed;
  cur.circleLost = pinFull - points;
  roundLog.push(cur);

  drawMarkers(); // red = real place, blue = your pin
  // zoom the map so both pins are in view
  animateTo(fitTo([toXY(S.pin.lat, S.pin.lon), toXY(randval.lat, randval.lon)]), 900);
  mapInfo.textContent =
    `Your pin was ${Math.round(distance).toLocaleString()} km away. ` +
    `+${points} points!${areaHintUsed ? ` (hint: -${AREA_HINT_COST})` : ""} (This round: ${roundPoints + points})`;
  confirmBtn.classList.add("hidden");
  areaHintBtn.classList.add("hidden");
  nextBtn.textContent = "Learn about it";
  nextBtn.classList.remove("hidden");
  // The next button appears right where Confirm was, so a double-click would skip the result.
  // Keep it disabled for a moment.
  nextBtn.disabled = true;
  setTimeout(function () {
    nextBtn.disabled = false;
  }, 800);
});

// Info page: show the landmark's name, picture, and some facts.
function showInfo() {
  mapBox.classList.add("hidden");
  document.getElementById("infoName").textContent = randval.name;
  document.getElementById("infoPlace").textContent = `${randval.place}, ${randval.country} · ${randval.year}`;
  const pic = document.getElementById("infoPicture");
  pic.src = randval.image;
  pic.alt = randval.name;
  document.getElementById("infoFact").textContent = `Fun fact: ${randval.fact}`;
  document.getElementById("infoHistory").textContent = randval.history;
  const list = document.getElementById("infoKeyFacts");
  list.innerHTML = ""; // clear the previous landmark's facts
  for (const f of randval.keyFacts) {
    const li = document.createElement("li");
    li.textContent = f;
    list.appendChild(li);
  }
  infoNext.textContent = round >= ROUNDS ? "See final score" : "Next landmark";
  infoBox.classList.remove("hidden");
  window.scrollTo(0, 0);
}

nextBtn.addEventListener("click", showInfo);

infoNext.addEventListener("click", function () {
  infoBox.classList.add("hidden");
  if (round >= ROUNDS) {
    const best = (difficulty === "easy" ? POINTS_EASY : POINTS_EXACT) + POINTS_MAP;
    document.getElementById("finalScore").textContent = `Final Score: ${score} / ${ROUNDS * best}`;
    showSummary();
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
    if (!answered) {
      cur.answer = textBox.value.trim();
      cur.result = result === "exact" ? "Correct" : result === "typo" ? "Typo" : "Wrong";
      cur.letterHints = hintsUsed;
    }

    if (result === "exact") {
      const pts = afterHints(POINTS_EXACT);
      cur.letterLost = POINTS_EXACT - pts;
      finishRound(pts, `Correct! +${pts} points!${hintNote()}`);
    } else if (result === "typo") {
      const pts = afterHints(POINTS_TYPO);
      cur.letterLost = POINTS_TYPO - pts;
      finishRound(pts, `Close, typo! +${pts} points!${hintNote()}`);
    } else {
      finishRound(0, `Incorrect! The correct answer is: ${randval.name}`);
    }
  }
});


// game length
const quickBtn = document.getElementById("quickBtn");
const regularBtn = document.getElementById("regularBtn");

function setLength(rounds) {
  ROUNDS = rounds;
  quickBtn.classList.toggle("selected", rounds === 5);
  regularBtn.classList.toggle("selected", rounds === 10);
}

quickBtn.addEventListener("click", function () {
  setLength(5);
});

regularBtn.addEventListener("click", function () {
  setLength(10);
});


// tutorial part
const tutorialBox = document.getElementById("tutorial");

const tutorialSteps = [
  { title: "1. Name the landmark", text: "You'll see a photo, and then you have to guess the name of the landmark on the pictures. On easy mode, pick the right name from four choices. On hard mode, type the name of the landmark yourself." },
  { title: "2. Pin it on the map", text: "Guess the location of the landmark, click to pin where the landmark is on the world map, then press to confirm the location. Then you'll get point base on the location you pin, the closer you are, the more points you get." },
  { title: "3. Learn more about it", text: "Read a fun fact and a short history of the landmark!" },
];
let tutorialIndex = 0; // which page we are on (0 = the first)

function showTutorialStep() {
  const step = tutorialSteps[tutorialIndex];
  document.getElementById("tutTitle").textContent = step.title;
  document.getElementById("tutText").textContent = step.text;
  document.getElementById("tutCount").textContent = `${tutorialIndex + 1} / ${tutorialSteps.length}`;
  document.getElementById("tutBack").disabled = tutorialIndex === 0;
  const isLast = tutorialIndex === tutorialSteps.length - 1;
  document.getElementById("tutNext").textContent = isLast ? "Back to menu" : "Next";
}

function closeTutorial() {
  tutorialBox.classList.add("hidden");
  startBox.classList.remove("hidden");
}

document.getElementById("howBtn").addEventListener("click", function () {
  startBox.classList.add("hidden");
  tutorialBox.classList.remove("hidden");
  tutorialIndex = 0;
  showTutorialStep();
});

document.getElementById("tutNext").addEventListener("click", function () {
  if (tutorialIndex === tutorialSteps.length - 1) {
    closeTutorial();
  } else {
    tutorialIndex += 1;
    showTutorialStep();
  }
});

document.getElementById("tutBack").addEventListener("click", function () {
  tutorialIndex -= 1;
  showTutorialStep();
});


document.getElementById("easyBtn").addEventListener("click", function () {
  startGame("easy");
});

document.getElementById("hardBtn").addEventListener("click", function () {
  startGame("hard");
});

// End screen
function showSummary() {
  const box = document.getElementById("summary");
  box.innerHTML = "";
  const table = document.createElement("table");
  const head = table.insertRow();
  for (const h of ["#", "Landmark", "Your answer", "Naming", "Pin", "Hints used", "Round total"]) {
    const th = document.createElement("th");
    th.textContent = h;
    head.appendChild(th);
  }
  let lostLetters = 0;
  let lostCircle = 0;
  roundLog.forEach(function (r, i) {
    const row = table.insertRow();
    const hints = [];
    if (r.letterHints > 0) {
      hints.push(`${r.letterHints} letter${r.letterHints > 1 ? "s" : ""} (-${r.letterLost})`);
    }
    if (r.circle) {
      hints.push(`continent (-${r.circleLost})`);
    }
    lostLetters += r.letterLost;
    lostCircle += r.circleLost;
    const cells = [
      i + 1,
      r.name,
      r.answer || "-",
      `${r.result} (+${r.namePts})`,
      `${Math.round(r.km).toLocaleString()} km (+${r.pinPts})`,
      hints.length ? hints.join(", ") : "none",
      r.namePts + r.pinPts,
    ];
    cells.forEach(function (text, c) {
      const td = row.insertCell();
      td.textContent = text;
      if (c === 3) {
        td.className = r.result === "Wrong" ? "bad" : "good"; // red or green
      }
    });
  });
  box.appendChild(table);
  const note = document.createElement("p");
  note.textContent = `Points lost to hints: ${lostLetters + lostCircle}`;
  box.appendChild(note);
}

document.getElementById("again").addEventListener("click", function () {
  location.reload(); // reloads the page to go back to the start screen
});
