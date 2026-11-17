function removeThe(text) {  // removes the from every sentence
    text = text.toLowerCase().trim();

    if (text.startsWith("the ")) {
        text = text.slice(4);
    }

    return text;
}

const pictures = [
    { image: "images/Acropolis of athens.png", word: "acropolis" },
    { image: "images/Berlin Wall.jpg", word: "berlin wall" },
    { image: "images/Big ben.jpg", word: "big ben" },
    { image: "images/Bolivian Salt Flats.jpg", word: "salt flats" },
    { image: "images/Brooklyn College.jpg", word: "brooklyn college" },
    { image: "images/Christ The Redeemer.jpg", word: "christ the redeemer" },
    { image: "images/Cologne Cathedral.jpg", word: "cologne cathedral" },
    { image: "images/Easter Island.jpg", word: "easter island" },
    { image: "images/Eiffel Tower.jpg", word: "eiffel tower" },
    { image: "images/Golden Gate Bridge.jpg", word: "golden gate bridge" },
    { image: "images/Hollywood.jpg", word: "hollywood" },
    { image: "images/Leaning Tower Of pisa.jpg", word: "leaning tower of pisa" },
    { image: "images/machu picchu.jpg", word: "machu picchu" },
    { image: "images/Mount Everest.jpg", word: "mount everest" },
    { image: "images/Mount Fuji.jpg", word: "mount fuji" },
    { image: "images/Mount Rushmore.jpg", word: "mount rushmore" },
    { image: "images/Niagra Falls.jpg", word: "niagara falls" },
    { image: "images/Panama Canal.png", word: "panama canal" },
    { image: "images/Petra.jpg", word: "petra" },
    { image: "images/StoneHenge.jpg", word: "stonehenge" },
    { image: "images/Taj Mahal.jpg", word: "taj mahal" },
    { image: "images/the colosseum.jpg", word: "colosseum" },
    { image: "images/The Grand Canyon.jpg", word: "grand canyon" },
    { image: "images/The great Pyramid of giza.jpg", word: "pyramid of giza" },
    { image: "images/The great wall of china.jpg", word: "great wall of china" },
    { image: "images/The Nile River.jpg", word: "nile river" },
    { image: "images/The statue of liberty.jpg", word: "statue of liberty" },
    { image: "images/Time Square.jpg", word: "times square" },
    { image: "images/Wolrd Trade Center.jpg", word: "world trade center" }
];
let score = 0;
let randval = pictures[Math.floor(Math.random() * pictures.length)];
let userInput; 

console.log(randval);
document.getElementById("picture").src = randval.image; // this is to pick a random picture in list



const textBox = document.createElement("input"); // the box that we will append to
textBox.type = "text"; //what kind of box 
textBox.id = "answer"; //id for the box
textBox.placeholder = "Type the landmark name"; //placeholder text
document.getElementById("game").appendChild(textBox); //add after picture
textBox.focus(); 

userInput = textBox.value;
console.log(userInput);

textBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        userInput = textBox.value; 
        console.log(textBox.value);

        if (removeThe(userInput) === randval.word){
            score +=1
            textBox.value = ""; 
            randval = pictures[Math.floor(Math.random() * pictures.length)];
            console.log(randval);
            document.getElementById("picture").src = randval.image; // this is to pick a random picture in list
    }
}
});

