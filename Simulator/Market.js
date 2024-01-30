let NumberOfBuyers = GetNumberOfBuyers();
let NumberOfSellers = GetNumberOfSellers();
let RoundsOfTrading = GetNumberOfTradingRounds();


let Buyers = [];
let Sellers = [];

let Transactions = 0;



function InitializeVariables() {
    NumberOfBuyers = GetNumberOfBuyers();
    NumberOfSellers = GetNumberOfSellers();
    RoundsOfTrading = GetNumberOfTradingRounds();

    Buyers = [];
    Sellers = [];
}


// Stats

function GetAverageFirstPrice() {
    let Total = 0;
    Sellers.forEach(seller => Total += seller.FirstPrice);

    return Math.round(Total / Sellers.length);
}

function GetAverageProductionCost() {
    let Total = 0;
    Sellers.forEach(seller => Total += seller.MinimumAcceptable);

    return Math.round(Total / Sellers.length);
}

function GetAverageAcceptablePrice() {
    let Total = 0;
    Buyers.forEach(buyer => Total += buyer.MaximumPayable);

    return Math.round(Total / Buyers.length);
}

function GetPrice() {
    let Total = 0;
    seller = Sellers.sort((a, b) => a.Price - b.Price);
    seller = seller.slice(0, 5)
    seller.forEach(s => Total += s.Price);
    return Math.round(Total / seller.length);
}

function GetMedianFirstPrice() {
    Sellers.sort((a, b) => a.FirstPrice - b.FirstPrice);

    let Median;
    if (Sellers.length % 2 == 0) Median = (Sellers[(Sellers.length / 2)].FirstPrice + Sellers[(Sellers.length / 2) + 1].FirstPrice) / 2;
    else Median = Sellers[Math.ceil(Sellers.length / 2)].FirstPrice;

    return Math.round(Median);
}

function GetMedianPrice() {
    Sellers.sort((a, b) => a.Price - b.Price);

    let Median;
    if (Sellers.length % 2 == 0) Median = (Sellers[(Sellers.length / 2)].Price + Sellers[(Sellers.length / 2) + 1].Price) / 2;
    else Median = Sellers[Math.ceil(Sellers.length / 2)].Price;

    return Math.round(Median);
}

function StartMarket() {

    RunSimulationBtn.style.visibility = "hidden";
    RunSimulationBtn.removeEventListener("click", StartMarket);
    OutputDivStatus.style.visibility = "visible";
    OutputDivData.style.visibility = "hidden";

    InitializeVariables();

    //create a worker to do the trading
    let TradeWorker = new Worker("Simulator/Trade.js");

    TradeWorker.postMessage({
        NumberOfBuyers: NumberOfBuyers,
        NumberOfSellers: NumberOfSellers,
        HowToChooseSeller: HowToChooseSeller(),
        RoundsOfTrading: RoundsOfTrading
    })

    // after trading done
    TradeWorker.onmessage = function (e) {
        Sellers = e.data.Sellers;
        Buyers = e.data.Buyers;
        Transactions = e.data.Transactions;

        DisplayOutput();
        OutputDiv.style.visibility = "visible";
        RunSimulationBtn.style.visibility = "visible";
        RunSimulationBtn.addEventListener("click", StartMarket);
        OutputDivStatus.style.visibility = "hidden";
        OutputDivData.style.visibility = "visible";
    }
}