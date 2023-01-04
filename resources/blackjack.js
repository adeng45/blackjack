const deck = []
const playerHand = []
const houseHand = []

window.onload = () => 
    initGame();

function initGame() {

    buildDeck();
    shuffleDeck();

    addCard(playerHand);
    addCard(playerHand);

    addCard(houseHand);
    addCard(houseHand);

}

function buildDeck() {

    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let types = ['D', 'C', 'H', 'S'];

    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < types.length; j++) {
            deck.push(values[i] + '_' + types[j]);
        }
    }

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

function isBust(player) {

    return evalHand(player, false, false) <= 21;

}




