// klasa mem
export class MemClass {
    id : number;
    name : string;
    price : number;
    url : string;
    priceHist : number[];

	constructor(id : number, name : string, price : number, url : string){
        this.id = id;
        this.name = name;
        this.price = price;
        this.url = url;
        this.priceHist = [price];
    }
    changePrice(newPrice : number) : void{
        this.price = newPrice;
        this.priceHist.unshift(newPrice);
    }
}