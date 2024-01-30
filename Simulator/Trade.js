// worker thread file

let NumberOfBuyers, NumberOfSellers;
let Buyers = [];
let Sellers = [];
let Transactions = 0;
let lastRoundPrices = [];

self.importScripts("Buyer.js", "Seller.js");

// buyer and seller attempt to do a transction
function Trade(Rounds, HowToChooseSeller) {

    for (let Round = 0; Round < Rounds; Round++) {
        Buyers.forEach(buyer => {
            let seller;
            if (HowToChooseSeller == "Random") {
                seller = GetRandomSeller();
            } else {
                seller = Sellers.sort((a, b) => a.Price - b.Price);
                seller = seller.filter(x => x.Visited == false)
            }
                // seller = seller.filter(x => x.Transactions <= 10)
                seller = seller[0]
                // if (seller && seller.Price <= buyer.MaximumPayable && buyer.Transactions <= 10 && seller.Transactions <= 10) {
                if (seller && seller.Price <= buyer.MaximumPayable) {
                if (Round == Rounds - 1){
                        lastRoundPrices.push(seller.Price)
                    }
                // successful transaction
                buyer.CompleteTransaction(true, seller.Price);
                seller.CompleteTransaction(true);
                Transactions++;
            }
        });
        Sellers.forEach(seller => {
            seller.AdjustPrice(seller.Visited); //if the seller was not visited, adjust price downwards
            seller.SummedPrices += seller.Price;
        });
        Sellers.forEach(seller => {
            seller.Visited = false
        });
        shuffle(Buyers);
    }
}

function GetRandomSeller() {
    let RandomSeller = Math.round(Math.random() * (Sellers.length - 1));
    return Sellers[RandomSeller];
}


function CreateTraders(NumberOfBuyers, NumberOfSellers) {
    for (let i = 0; i < NumberOfBuyers; i++) Buyers.push(new Buyer);
    for (let i = 0; i < NumberOfSellers; i++) Sellers.push(new Seller);
}

onmessage = function (e) {
    const NumberOfBuyers = e.data.NumberOfBuyers;
    const NumberOfSellers = e.data.NumberOfSellers;
    const HowToChooseSeller = e.data.HowToChooseSeller;
    const RoundsOfTrading = e.data.RoundsOfTrading;
    CreateTraders(NumberOfBuyers, NumberOfSellers)

    Trade(RoundsOfTrading, HowToChooseSeller);

    postMessage({
        Sellers: Sellers,
        Buyers: Buyers,
        Transactions: Transactions,
        lastRoundPrices: lastRoundPrices
    });
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }