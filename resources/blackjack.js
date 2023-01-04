const deck = buildDeck();
const playerHand = [];
const houseHand = [];
var isOver = false;

window.onload = function() {

    newGame();
    renderHands(true);
    
    document.getElementById("draw").addEventListener("click", draw);
    document.getElementById("play").addEventListener("click", play);

}

function newGame() {

    deck.push(...playerHand);
    deck.push(...houseHand);

    playerHand.length = 0;
    houseHand.length = 0;

    document.getElementById("result").innerHTML = "";
    isOver = false;
    
    shuffleDeck();

    addCard(playerHand);
    addCard(playerHand);

    addCard(houseHand);
    addCard(houseHand);

    renderHands(true);

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

    hand.push(deck.pop());

}

function evalHand(hand, isMax, isBest) {

    let sum = 0;
    let numAces = 0;
    
    for (let i = 0; i < hand.length; i++) {

        let value = hand[i][0];
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

function draw() {

    if (isOver) {
        return;
    }

    addCard(playerHand);
    renderHands(true);

    if (isBust()) {
        endGame();
    }

}

function play() {
    endGame();
}

function endGame() {

    let houseScore = evalHand(houseHand, true, true);
    while (houseScore < 17) {
        addCard(houseHand);
        houseScore = evalHand(houseHand, true, true);
    }
    
    renderHands(false);

    var msg;
    let playerScore = evalHand(playerHand, true, true);

    if (playerScore > 21) {
        msg = 'You LOSE!';
    }

    else if (houseScore > 21) {
        msg = 'You WIN!';
    }

    else if (playerScore == houseScore) {

        if (playerScore == 21) {

            if (playerHand.length == 2) {
                
                if (houseHand.length == 2) {

                    msg = 'TIE!';

                }

                else {

                    msg = 'You WIN!';

                }

            }

            else {

                if (houseHand.length == 2) {

                    msg = 'You LOSE!';

                }

                else {

                    msg = 'TIE!';

                }

            }

        }

        else {
            msg = 'TIE!';
        }
        
    }

    else if (playerScore > houseScore) {

        msg = 'You WIN!';

    }

    else {

        msg = 'YOU LOSE!';

    }

    document.getElementById("result").innerHTML = msg;
    isOver = true;

}



