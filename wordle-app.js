import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let dDay = new Date("Mar 26, 2022 23:59:99");
let rightGuessString = ''
let white = document.getElementById("white").textContent
let orange = document.getElementById("orange").textContent
let diamond = document.getElementById("diamond").textContent
let resString = ''
let resArr = [['','','','',''],
              ['','','','',''],
              ['','','','',''],
              ['','','','',''],
              ['','','','',''],
              ['','','','','']]

let now = new Date()
if (isSameDateAs(now, new Date("Mar 22 2022"))){
    rightGuessString = WORDS[0];
} else if (isSameDateAs(now, new Date("Mar 23 2022"))){
    rightGuessString = WORDS[1];
} else if (isSameDateAs(now, new Date("Mar 24 2022"))){
    rightGuessString = WORDS[2];
} else if (isSameDateAs(now, new Date("Mar 25 2022"))){
    rightGuessString = WORDS[3];
} else if (isSameDateAs(now, new Date("Mar 26 2022"))){
    rightGuessString = WORDS[4];
} else if (isSameDateAs(now, new Date("Mar 27 2022"))){
    rightGuessString = WORDS[5];
} else if (isSameDateAs(now, new Date("Mar 28 2022"))){
    rightGuessString = WORDS[6];
} else if (isSameDateAs(now, new Date("Mar 29 2022"))){
    rightGuessString = WORDS[7];
} else {
    rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
}
function initBoard() {
    let board = document.getElementById("game-board");
    
    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}
function isSameDateAs (nDate,pDate) {
    return (// www  .j a  v a  2 s.co  m
      nDate.getFullYear() === pDate.getFullYear() &&
      nDate.getMonth() === pDate.getMonth() &&
      nDate.getDate() === pDate.getDate()
    );
}
function checkGuess () {
    let rowInd = 6 - guessesRemaining
    let row = document.getElementsByClassName("letter-row")[rowInd]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    
    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            resArr[rowInd][i] = white
            letterColor = '#e8e4c9'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                resArr[rowInd][i] = diamond
                letterColor = '#f7cac9'
            } else {
                // shade box yellow
                resArr[rowInd][i] = orange
                letterColor = '#b3cee5'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.color = "black"
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over! Click the share icon to copy result.")
        
        for(let i=0; i<5; i++){
            for(let j=0; j<5; j++){
                resString=resString+resArr[i][j]
            }
            resString=resString+"\n"
        }
        resString = "CARAT들 beautiful!\n\n"+resString
        console.log(resString)
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over! Click the share icon to copy result.")
            toastr.info(`The right word was: "${rightGuessString}"`)
        }
    }
}

function insertLetter (pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

document.addEventListener("keyup", (e) => {
    let pressedKey = String(e.key)
    if(!pressedKey.match(/^[a-zA-Z]+$/gi)) {return}
    if (guessesRemaining === 0) {
        return
    }

    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent
    
    if (key === "←") {
        key = "Backspace"
    }
    if (key === "↵") {
        key = "Enter"
    } 
    

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

// Get the modal
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("resultModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");
var btn2 = document.getElementById("share")
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.addEventListener("click", function() {
    modal.style.display = "block";
})
btn2.addEventListener("click", function() {
    navigator.clipboard.writeText(resString);
    toastr.info("Result copied!")
})

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
})


// Set the date we're counting down to
var countDownDate = new Date("March 26, 2022 23:59:99").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);

initBoard();
