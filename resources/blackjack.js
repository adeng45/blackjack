const deck = buildDeck();
const playerHand = [];
const houseHand = [];

var hidden;

var isOver = false;

window.onload = function() {
    
    newGame();
    document.getElementById("reset").addEventListener("click", newGame);
    document.getElementById("draw").addEventListener("click", draw);
    document.getElementById("play").addEventListener("click", play);

}

// Game initialization.
async function newGame() {

    lock();

    // Deck receives all the cards.
    deck.push(...playerHand);
    deck.push(...houseHand);
    playerHand.length = 0;
    houseHand.length = 0;

    // Refresh the stage.
    document.getElementById("self-cards").innerHTML = "";
    document.getElementById("house-cards").innerHTML = "";
    document.querySelector(".win").classList.remove("show");
    document.querySelector(".tie").classList.remove("show");
    document.querySelector(".lose").classList.remove("show");
    document.querySelector(".symbol-container").classList.add("scale");

    shuffleDeck();

    let c1 = addCard(playerHand);
    let c2 = addCard(playerHand);
    hidden = addCard(houseHand);
    let c3 = addCard(houseHand);


    await delay(1000);
    flipCard(c1);
    flipCard(c2);
    flipCard(c3);

    await delay(750);
    unlock();

}

// A gimmick to pause code execution.
function delay(pause) {
    return new Promise(res => setTimeout(res, pause));
}

// Constructs the deck. Done once through page history.
function buildDeck() {

    let deck = [];

    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let types = ['D', 'C', 'H', 'S'];

    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < types.length; j++) {
            deck.push(values[i] + '_' + types[j]);
        }
    }

    return deck;

}

// Shuffles the deck.
function shuffleDeck() {

    for (let i = 0; i < deck.length; i++) {

        let j = Math.floor(Math.random() * deck.length);
        temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;

    }

}

// Adds a card to the player's hand in the DOM and the playerHand variable.
function addCard(hand) {

    let c = deck.pop();
    hand.push(c);

    var card;
    var front;
    var back;

    card = document.createElement("div");
    card.className = "card";

    front = document.createElement("img");
    front.src = "images/cards/back.png";
    front.className = "card-front"

    back = document.createElement("img");
    back.src = "images/cards/" + c + ".png";
    back.className = "card-back";

    card.append(front);
    card.append(back);

    if (hand === playerHand) {
        document.getElementById("self-cards").append(card);
    }

    else {
        document.getElementById("house-cards").append(card);
    }

    return card;

}

// "Flips" the card in the DOM.
function flipCard(card, pause) {

    card.classList.toggle("is-flipped");

}

// Evaluates the score of the hand.
// isMax toggles the value of A to be either 1 or 11.
// isBest calculates the best score by picking the best value for A.
function evalHand(hand, isMax, isBest) {

    let sum = 0;
    let numAces = 0;
    
    for (let i = 0; i < hand.length; i++) {

        let value = hand[i].split('_')[0];
        if (isNaN(value)) {
            if (value == 'A') {
                if (isMax || isBest) {
                    sum += 11;
                    numAces += 1;
                }
                else {
                    sum += 1;
                }
            }
            else {
                sum += 10;
            }
        }
        else {
            sum += parseInt(value);
        }

    }

    if (!isBest) {
        return sum;
    }

    while (sum > 21 && numAces > 0) {
        sum -= 10
        numAces -= 1
    }

    return sum;

}

// Check to see if the player's score exceeds 21.
function isBust() {

    return evalHand(playerHand, false, false) > 21;

}

// Player is busted.
function busted() {
    document.getElementById("reset").disabled = false;
    document.getElementsByClassName("symbol")[0].classList.toggle("scale");
    document.getElementsByClassName("lose")[0].classList.toggle("show");
}

// Old function for choppy hand rendering.
function renderHands(isOver) {

    // House hand.
    let hand = document.getElementById("house-cards");
    hand.innerHTML = "";

    var cardImg;

    // If the game is not over, hide the first card.
    if (isOver) {

        cardImg = document.createElement("img");
        cardImg.src = "images/cards/back.png";
        hand.append(cardImg); 

        for (let i = 1; i < houseHand.length; i++) {
            cardImg = document.createElement("img");
            cardImg.src = "images/cards/" + houseHand[i] + ".png";
            hand.append(cardImg);   
        }
        
    }

    // Reveal the hidden card since the game is over.
    else {

        for (let i = 0; i < houseHand.length; i++) {
            cardImg = document.createElement("img");
            cardImg.src = "images/cards/" + houseHand[i] + ".png";
            hand.append(cardImg);   
        }

    }

    // The player's hand.
    hand = document.getElementById("self-cards");
    hand.innerHTML = ""; 
    
    for (let i = 0; i < playerHand.length; i++) {
        cardImg = document.createElement("img");
        cardImg.src = "images/cards/" + playerHand[i] + ".png";
        hand.append(cardImg);
    }

}

// Locks all buttons.
function lock() {
    document.getElementById("draw").disabled = true;    
    document.getElementById("play").disabled = true;
    document.getElementById("reset").disabled = true;
}

// Unlocks all buttons.
function unlock() {
    document.getElementById("draw").disabled = false;    
    document.getElementById("play").disabled = false;
    document.getElementById("reset").disabled = false;
}

// Draws a card.
async function draw() {

    lock();

    card = addCard(playerHand);
    await delay(250);
    flipCard(card);
    await delay(750);


    if (isBust()) {
        await delay(750);
        busted();
    }
    
    else {
        unlock();    
    }

}

// Play your hand/end the game.
function play() {

    endGame();

}

// End the game.
async function endGame() {

    lock();

    // House draw phase.
    let houseScore = evalHand(houseHand, true, true);
    let card;
    let wait = true;
    while (houseScore < 17) {
        wait = false;
        card = addCard(houseHand);
        await delay(300);
        flipCard(card);
        await delay(1000);
        houseScore = evalHand(houseHand, true, true);
    }
    
    // Determine the outcome of the game.
    let result;
    let playerScore = evalHand(playerHand, true, true);

    // House is busted.
    if (houseScore > 21) {
        result = "win";
    }

    // Equal scores.
    else if (playerScore == houseScore) {

        if (playerScore == 21) {

            // If player has blackjack.
            if (playerHand.length == 2) {

                // If the house has blackjack.
                if (houseHand.length == 2) {
                    result = "tie";
                }
                else {
                    result = "win";
                }

            }

            else {

                // If the house has blackjack but not the player.
                if (houseHand.length == 2) {
                    result = "lose";
                }
                // All other cases where both hands have a score of 21 but no one has blackjack.
                else {
                    result = "win";
                }

            }
        }

        // Scores are equal but no one has blackjack.
        else {
            result = "tie";
        }
    }
    
    //Player score is higher than house score.
    else if (playerScore > houseScore) {
        result = "win";
    }

    //Player score is less than house score.
    else {
        result = "lose";
    }

    if (wait) {
        await delay(1000);
    }

    //Don't make the player wait too long!
    else {
        await delay(250);
    }

    flipCard(hidden);

    // Show the game result.
    await delay(1500);
    document.getElementById("reset").disabled = false;
    document.querySelector(".symbol-container").classList.toggle("scale");
    document.querySelector('.' + result).classList.toggle("show");

}









