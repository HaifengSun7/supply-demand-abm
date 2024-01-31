class Seller {

    MinimumAcceptable; // the minimum price a seller can accept for the commodity (production cost)
    FirstPrice; // the price this seller entered the market with
    Price; // current price the seller is posting
    SummedPrices = 0; // sum of all prices the seller has posted since opening of market 

    Transactions = 0;
    Revenue = 0; // total amount collected from sales
    Profit = 0; // revenue - production cost

    Visited = false; // whether a customer visited the seller

    // how much the seller will adjust price depending on how the market is
    PriceAdjustmentFactor = {
        Up: (1.005),
        Down: (0.95)
    }

    constructor() {
        this.MinimumAcceptable = Seller.GetRandomCost();
        this.Price = Seller.GetRandomPrice(this.MinimumAcceptable);
        this.FirstPrice = this.Price;
    }

    AdjustPrice(SuccessfulSale) {
        if (SuccessfulSale) {
            // price adjusted upwards if the previous transaction was successful
            this.Price *= this.PriceAdjustmentFactor.Up;
        } else {
            // price adjusted downwards if the previous transaction was not successful
            if (this.Price * this.PriceAdjustmentFactor.Down < this.MinimumAcceptable) this.Price = this.MinimumAcceptable;
            else this.Price *= this.PriceAdjustmentFactor.Down;
        }
    }

    CompleteTransaction(SuccessfulSale) {
        if (SuccessfulSale) {
            this.Transactions++;
            this.Revenue += this.Price;
            this.Profit += this.Price - this.MinimumAcceptable; 
        }
        this.Visited = true;
    }

    

    static GetRandomPrice(ProductionCost) {
        return getRandomInt(ProductionCost, ProductionCost * 2); // selling price must be above cost
    }
    static GetRandomCost() {
        return getRandomInt(0, 100);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}