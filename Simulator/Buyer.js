class Buyer {

    MaximumPayable; // the maximum price a buyer can pay for the commodity

    Transactions = 0; // number of transctions it is involved in
    TotalSpent = 0; // total amount spent on buying commodities from sellers

    constructor() {
        this.MaximumPayable = Buyer.GetRandomAmount();
    }

    CompleteTransaction(SuccessfulSale, Price) {
        if (SuccessfulSale) {
            this.Transactions++;
            this.TotalSpent += Price;
        }
    }

    static GetRandomAmount() {
        return getRandomInt(0, 150);
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}