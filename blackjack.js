let playerCards = [10, 11];
let playerSum = playerCards.reduce((a, b) => a + b, 0);

let dealerCards = [8, 5];
let dealerSum = dealerCards.reduce((a, b) => a + b, 0);

if (playerSum === 21) {
    console.log('You Win')
} else if (playerSum > 21) {
    console.log('You lost dealer Win')
} else {
    while (dealerSum < 17) {
        let newCard = Math.floor(Math.random() * 11) + 1;
        dealerSum += newCard
    }
    if (dealerSum > 21) {
        console.log(`dealer ${dealerSum} bust You Win`)
    } else if (playerSum === dealerSum) {
        console.log('Draw')
    } else if (playerSum > dealerSum) {
        console.log(`dealer ${dealerSum} bust You Win`)
    } else {
        console.log(`you ${playerSum} bust dealer ${dealerSum} Win`)
    }
} 



   