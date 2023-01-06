const deck = buildDeck();
const playerHand = [];
const houseHand = [];
var hidden;

var isOver = false;

window.onload = function() {
    
    newGame();
    document.getElementById("draw").addEventListener("click", draw);
    document.getElementById("play").addEventListener("click", play);
    document.getElementById("reset").addEventListener("click", newGame);

}

async function newGame() {

    deck.push(...playerHand);
    deck.push(...houseHand);

    document.getElementById('self-cards').innerHTML = "";
    document.getElementById('house-cards').innerHTML = "";
    playerHand.length = 0;
    houseHand.length = 0;

    // document.getElementById("result").innerHTML = "";
    isOver = false;
    
    shuffleDeck();

    let c1 = addCard(playerHand);
    let c2 = addCard(playerHand);
    hidden = addCard(houseHand);
    let c3 = addCard(houseHand);

    await delay(1000);
    flipCard(c1);
    flipCard(c2);
    flipCard(c3);

}

function delay(pause) {
    return new Promise(res => setTimeout(res, pause));
}

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

function shuffleDeck() {

    for (let i = 0; i < deck.length; i++) {

        let j = Math.floor(Math.random() * deck.length);
        temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;

    }

}

function refresh() {
    
    playerHand.forEach( () => deck.push(item) );
    houseHand.forEach( () => deck.push(item) );

    playerHand.length = 0;
    houseHand.length = 0;

}

function addCard(hand) {

    let c = deck.pop();
    hand.push(c);

    var card;
    var front;
    var back;

    card = document.createElement("div");
    card.className = "card";

    front = document.createElement("img");
    front.src = "cards/back.png";
    front.className = "front"

    back = document.createElement("img");
    back.src = "cards/" + c + ".png";
    back.className = "back";

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

function flipCard(card, pause) {

    card.classList.toggle("is-flipped");

}

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

function isBust() {

    return evalHand(playerHand, false, false) > 21;

}

function renderHands(isOver) {

    // House hand
    let hand = document.getElementById("house-cards");
    hand.innerHTML = "";

    var cardImg;

    // If the game is not over, hide the first card.
    if (isOver) {

        cardImg = document.createElement("img");
        cardImg.src = "cards/back.png";
        hand.append(cardImg); 

        for (let i = 1; i < houseHand.length; i++) {
            cardImg = document.createElement("img");
            cardImg.src = "cards/" + houseHand[i] + ".png";
            hand.append(cardImg);   
        }
        
    }

    // Reveal the dealer's card since the game is over.
    else {

        for (let i = 0; i < houseHand.length; i++) {
            cardImg = document.createElement("img");
            cardImg.src = "cards/" + houseHand[i] + ".png";
            hand.append(cardImg);   
        }

    }

    // The player's hand
    hand = document.getElementById("self-cards");
    hand.innerHTML = ""; 
    
    for (let i = 0; i < playerHand.length; i++) {
        cardImg = document.createElement("img");
        cardImg.src = "cards/" + playerHand[i] + ".png";
        hand.append(cardImg);
    }

}

async function draw() {

    if (isOver) {
        return;
    }

    card = addCard(playerHand);
    await delay(250);
    flipCard(card);

    if (isBust()) {
        await delay(1750);
        endGame();
    }

}

function play() {
    endGame();
}

async function endGame() {

    let houseScore = evalHand(houseHand, true, true);
    let card;
    while (houseScore < 17) {
        card = addCard(houseHand);
        await delay(100);
        flipCard(card);
        await delay(200);
        houseScore = evalHand(houseHand, true, true);
    }
    
    var result;
    let playerScore = evalHand(playerHand, true, true);

    if (playerScore > 21) {
        result = 'L';
    }

    else if (houseScore > 21) {
        result = 'W';
    }

    else if (playerScore == houseScore) {

        if (playerScore == 21) {

            if (playerHand.length == 2) {
                
                if (houseHand.length == 2) {

                    result = 'T';

                }

                else {

                    result = 'W';

                }

            }

            else {

                if (houseHand.length == 2) {

                    result = 'L';

                }

                else {

                    result = 'W';

                }

            }

        }

        else {
            result = 'T';
        }
        
    }

    else if (playerScore > houseScore) {

        result = 'W';

    }

    else {

        result = 'L';

    }

    await delay(1000);
    flipCard(hidden);

    // document.getElementById("result").innerHTML = result;
    isOver = true;

}






