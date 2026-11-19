function removeThe(text) {
  // removes the from every sentence
  text = text.toLowerCase().trim();

  if (text.startsWith("the ")) {
    text = text.slice(4);
  }

  return text;
}

const ROUNDS = 5;
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

    if (randval.answers.includes (removeThe(userInput))) {
      score += 1;
      feedback.textContent = "Correct!";
    } else {
      feedback.textContent = `Incorrect! The correct answer is: ${randval.answers[0]}`;
    }

    document.getElementById("score").textContent = `Score: ${score}`; // this is to show the score

    if (round >= ROUNDS) {
      picture.classList.add("hidden");
      textBox.classList.add("hidden");
      document.getElementById("finalScore").textContent = `Final Score: ${score} / ${ROUNDS}`;
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
